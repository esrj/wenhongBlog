const io = require('../socket')
const model = require('../model/model')

exports.msg = (req,res,next) => {
    if (req.method === 'GET'){
        const username = req.query['username']
        if(username){
            model.User.findOne({'_id':username}).then(target=>{
                if(target){
                    model.Message.find({
                        $or: [
                            { sender: target,receive:req.user },
                            { sender: req.user,receive: target }
                        ]
                    }).populate('sender').limit(50).then(msgs=>{
                        res.render('msg/msg',{
                            msgs:msgs,
                            target:target,
                            empty: false
                        })
                    })
                }else{
                    res.redirect('/')
                }
            })
        }else{
            res.render('msg/msg',{
                msgs:[],
                target: {'email':'請先選擇使用者','_id':'none'},
                empty: true
            })
        }
    }
    if (req.method === 'POST'){
        model.Follow.find({'followed':req.user}).populate('follower').then(user=>{
            res.send({errno:0,user:user})
        })
    }
}

exports.send = (req,res,next) =>{
    const content = req.body.content
    const targetId = req.body.targetId
    model.User.findOne({_id:targetId}).then(target=>{
        const msg = new model.Message({sender:req.user,receive:target,content:content})
        msg.save()
        io.getIO().emit(`${req.user._id}to${targetId}`,{
            content:content,
            sender:req.user,
            receive:target
        })
        return res.send({'errno':0})
    })
}
