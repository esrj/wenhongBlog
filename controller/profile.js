const model = require('../model/model')
const io = require('../socket')


exports.profile = (req,res,next)=>{
    const id = req.params.id
    if(id === req.user._id.toString()){
        model.Post.find({userId:id}).then(posts=>{
            model.Follow.find({followed: req.user}).then(fans=>{
                model.Follow.find({follower: req.user}).then(follow=>{
                    return res.render('profile/profile.ejs',{
                        posts: posts,
                        postsNum: posts.length,
                        profile: req.user,
                        auth: true,
                        fans: fans.length,
                        follow: follow.length
                    })
                })
            })
        })
    }else{
        model.Post.find({userId:id}).then(posts=>{
            model.User.findById(id).then(profile=>{
                model.Follow.find({followed: profile}).then(fans=>{
                    model.Follow.find({follower: profile}).then(follow=>{
                        model.Follow.findOne({follower : req.user,followed: profile}).then(result=>{
                            let isfollow = false
                            if(result){
                                isfollow = true
                            }
                            return res.render('profile/profile.ejs',{
                                posts: posts,
                                postsNum: posts.length,
                                profile: profile,
                                auth: false,
                                fans: fans.length,
                                follow: follow.length,
                                isfollow: isfollow
                            })
                        })
                    })
                })
            })
        })
    }
}

exports.single = (req,res,next) =>{
    const id = req.params.id
    model.Post.findById(id).populate('userId').then(post=>{
        if(post){

            model.Like.findOne({post:post,author:req.user}).then(like=>{
                if(like){
                    return true
                }else{
                    return false
                }
            }).then(isLike=>{
                if(req.user){
                    model.Follow.find({ follower: req.user._id }).populate('followed').then((followedUsers) => {
                        const followedUserIds = followedUsers.map(follow => follow.followed);
                        model.User.find({$and:[{_id: { $nin: followedUserIds } }, {_id: { $nin: req.user._id}}]}).then((users) => {
                            const count = users.length
                            if(count<=4){
                                res.render('profile/single',{
                                    randomUnFollowList:users,
                                    post:post,
                                    isLike :isLike
                                })
                            }else{
                                const randomInteger = Math.floor(Math.random() * (count-3));
                                const randomUnFollowList = users.slice(randomInteger,randomInteger+4)
                                res.render('profile/single',{
                                    randomUnFollowList:randomUnFollowList,
                                    post:post,
                                    isLike :isLike
                                })
                            }
                        })
                    })
                }else{
                    res.render('index/index',{
                        randomUnFollowList:[],
                        post:post,
                    })
                }
            })
        }else{
            res.redirect('/')
        }
    }).catch((e)=>{
        res.redirect('/')
    })
}

exports.like = (req,res,next) =>{
    const id = req.params.id
    const isLike = req.body.isLike
    if(isLike){
        model.Post.findById(id).then(post=>{
            post.like += 1
            post.save()
            const like = new model.Like({author:req.user,post: post})
            like.save().then(()=>{
                res.end()
            })
        })
    }else{
        console.log('delete like')
        model.Post.findById(id).then(post=>{
            post.like -= 1
            post.save()
            model.Like.deleteMany({post: post,author: req.user}).then(()=>{
                return res.end()
            })
        })
    }
}

exports.edit = (req,res,next) =>{
    const id = req.params.id
    if(id === req.user._id.toString()){
        if(req.method === 'GET'){
            res.render('profile/edit')
        }else if(req.method === 'POST'){
            if(req.body.avatar){
                const image = req.file.path
                model.User.findById(id).then(user=>{
                    user.image = image
                    return user.save()
                }).then(()=>{
                    return res.send({'errno':0})
                })
            }else{
                model.User.findById(id).then(user=>{
                    user.info = req.body.info
                    return user.save()
                }).then(()=>{
                    return res.send({'errno':0})
                })
            }
        }
    }else{
        res.redirect('/')
    }
}

exports.follow = (req,res,next) =>{
    const id = req.params.id
    model.User.findById(id).then(user=>{
        if(user && user!==req.user){
            io.getIO().emit(`${user._id}`,{
                image:`/${req.user.image}`,
                type:'新的追蹤通知',
                content: `${req.user.email} 已經開始追蹤你`,
                url: `/profile/${req.user._id}`
            })
            const follower = req.user
            const followed = user
            const follow = new model.Follow({follower,followed})
            follow.save().then(()=>{
                return res.redirect(`/profile/${id}`)
            })
        }
    })
}

exports.disfollow = (req,res,next) =>{
    const id = req.params.id
    model.User.findById(id).then(profile=>{
        model.Follow.deleteOne({follower:req.user,followed: profile}).then(()=>{
            console.log(`/profile/${id}`)
            return res.redirect(`/profile/${id}`)
        })
    }).catch(()=>{
        res.redirect('/')
    })
}

// 尚未更新相片原檔刪除
exports.delete_account = (req,res,next) =>{
    const id = req.body.id
    model.User.findById(id).then(profile=>{
        if(profile._id.toString() === req.user._id.toString()){
            try{
                model.Post.deleteMany({userId: profile}).then(()=>{
                    model.Follow.deleteMany({$or: [{ follower: profile }, { followed: profile }]}).then(()=>{
                        model.Comment.deleteMany({userId:profile}).then(()=>{
                            model.User.deleteOne({"_id":profile}).then(()=>{
                                req.session.destroy()
                                res.send({'errno':0})
                            })
                        })
                    })
                })
            }catch(e){
                console.log('error is'+e)
                res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
    })
}

exports.fans_list = (req,res,next) =>{
    if(req.method === 'GET'){
        res.render('profile/fans')
    }else if(req.method === 'POST'){
        const id = req.params.id
        model.User.findById(id).then(profile=>{
            model.Follow.find({followed: profile}).populate('follower').then(fans=>{
                return res.send({errno:0,fans:fans})
            })
        })
    }
}

exports.follow_list = (req,res,next) => {
    if(req.method === 'GET'){
        res.render('profile/follow')
    }else if(req.method === 'POST'){
        const id = req.params.id
        model.User.findById(id).then(profile=>{
            model.Follow.find({follower:profile}).populate('followed').then(follows=>{
                return res.send({errno:0,follows:follows})
            })
        })
    }
}
