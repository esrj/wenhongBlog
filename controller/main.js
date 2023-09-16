const {validationResult} = require('express-validator')
const model = require('../model/model')
const bcrypt = require('bcrypt')
const transporter = require('../google/mail')
const crypto = require('crypto')
const {follow} = require("./profile");


exports.index = (req,res,next)=>{
    if(req.user){
        // 隨機推薦
        model.Follow.find({ follower: req.user._id }).populate('followed').then((followedUsers) => {
            const followedUserIds = followedUsers.map(follow => follow.followed);
            model.User.find({
                $and:[
                    {_id: { $nin: followedUserIds } },
                    {_id: { $nin: req.user._id}}
                ]
            }).then((users) => {
                const count = users.length
                if(count<=4){
                    res.render('index/index',{
                        randomUnFollowList:users,
                    })
                }else{
                    const randomInteger = Math.floor(Math.random() * (count-3));
                    const randomUnFollowList = users.slice(randomInteger,randomInteger+4)
                    res.render('index/index',{
                        randomUnFollowList:randomUnFollowList,
                    })
                }
            })
        })
    }else{
        res.render('index/index',{
            randomUnFollowList:[]
        })
    }
}

exports.login = (req,res,next) =>{
    if(res.locals.isAuthenticated || req.user){
        res.redirect('/')
    }else{
        if(req.method === "GET"){
            res.render('auth/login')
        }else if(req.method === 'POST'){
            const email = req.body.email
            const password = req.body.password
            model.User.findOne({email:email}).then(user=>{
                if(!user){
                    res.send({'errno':1})
                    res.end()
                }else{
                    bcrypt.compare(password,user.password).then(match=>{
                        if(match){
                            res.send({'errno':0})
                            req.session.isLogin = true
                            req.session.user = user
                            req.session.save()
                            const options = {
                                from: 'wenhongli0510@gmail.com',
                                to: user.email,
                                subject: '文宏商城', // Subject line
                                html:
                                   `<h1>歡迎登入</h1>
                                    <p>文宏部落客，登入帳號系統提示</p>`
                            };
                            console.log('prepare email')
                            transporter.sendMail(options, function(error, info){
                                if(!error){
                                    console.log('訊息發送: ' + info.response);
                                    res.end()
                                }else{
                                    console.log('出現錯誤')
                                    console.log(error)
                                }
                            });
                        }else{
                            res.send({'errno':2})
                            res.end()
                        }
                    }).catch(()=>{
                        res.redirect('/login')
                    })
                }
            })
        }
    }
}

exports.register = (req,res,next) =>{
    if(req.method === 'GET'){
        res.render('auth/register')
    }else if(req.method === 'POST'){
        const email = req.body.email
        const password = req.body.password
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            res.send({'errno':2})
            return res.end()
        }
        model.User.findOne({email:email}).then(user=>{
            if(user){
                res.send({'errno':1})
                return res.end()
            }else{
                bcrypt.hash(password,12).then(password=>{
                    const user = new model.User({
                        email:email,
                        password:password,
                    })
                    return user.save()
                }).then(()=>{
                    res.send({'errno':0})
                    return  res.end()
                })
            }
        })
    }
}

exports.logout = (req,res,next) =>{
    req.session.destroy()
    return res.send({'errno':0})
}

exports.reset = (req,res,next) =>{
    if(req.method === 'GET'){
        res.render('auth/reset',{
            reset:true
        })
    }
    if(req.method === 'POST'){
        const email = req.body.email
        model.User.findOne({email:email}).then(user=>{
            if(!user){
                return res.send({'errno':1})
            }else{
                crypto.randomBytes(32,(err,buf)=>{
                    user.resetToken = buf.toString('hex')
                    user.resetTokenExpiration =Date.now()+1000*60*60
                    user.save().then(()=>{
                        const token = user.resetToken
                        const options = {
                            from: 'sam24768379@gmail.com',
                            to: user.email,
                            subject: '文宏商城', // Subject line
                            html:
                                `<h1>重設密碼</h1>
                                <p>以下是重設密碼的連結 <a href="http://127.0.0.1:3000/reset/${token}" > 請點擊這裡</a></p>`
                        };
                        //發送信件
                        transporter.sendMail(options, function(error, info){
                            if(!error){
                                console.log('訊息發送: ' + info.response);
                                res.end()
                            }
                        });
                        return res.send({'errno':0})
                    })
                })
            }
        })
    }
}

exports.resetPassword = (req,res,next) =>{
    const token = req.params.token
    if(req.method === 'GET'){
        model.User.findOne({resetToken:token,resetTokenExpiration: {$gt: Date.now()}}).then(user=>{
            if(user){
                res.render('auth/reset',{
                    reset:false,
                    userId:user.id
                })
            }else{
                return res.redirect('/')
            }
        })
    }
    if(req.method === 'POST'){
        const userId = req.body.userId
        const password = req.body.password
        model.User.findOne({resetToken: token,resetTokenExpiration: {$gt: Date.now()},_id:userId}).then(user=>{
            if(!user){
                return res.redirect('/')
            }
            bcrypt.hash(password,12).then(hashpwd=>{
                user.password = hashpwd
                user.resetToken = undefined
                user.resetTokenExpiration =undefined
                user.save().then(()=>{
                    return res.send({'errno':0})
                })
            })
        })
    }
}
