const model = require('../model/model')

exports.upload = (req,res,next)=>{
    if (req.method === 'GET'){
        return res.render('index/upload',{
            user:req.user
        })
    }else if(req.method === 'POST'){
        const currentDate = new Date();
        const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`
        const userId = req.user._id
        const image =req.file.path
        const content = req.body.content
        const like = 0
        const Post = new model.Post({content,date,image,like,userId})
        Post.save().then(()=>{
            return res.send({'errno':0})
        })
    }
}

exports.load = (req,res,next) => {
    model.Post.find().populate('userId').then(posts=>{

        const promises = [];

        posts.forEach(post=>{
            const promise = model.Like.findOne({post: post,author: req.user}).then(like=>{
                if(like){
                    post['mark'] = true
                }else{
                    post['mark'] = false
                }
            })
            promises.push(promise);
        })

        Promise.all(promises).then(() => {
            if(req.user){
                posts.reverse()
                res.send({'errno':0,posts:posts})
            }else{
                posts.reverse()
                res.send({'errno':0,posts:posts})
            }
        })
    })
}

exports.comment = (req,res,next) =>{
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}`
    const content = req.body.comment
    const userId = req.user._id
    const id = req.body.id.split('-')[1]
    model.Post.findById(id).then(postId=>{
        if(postId){
            const Comment = new model.Comment({content,date,userId,postId})
            Comment.save()
            return res.send({'errno':0})
        }else{
            return res.send({'errno':1})
        }
    }).catch(()=>{
        return res.send({'errno':1})
    })
}

exports.show_comment = (req,res,next) =>{
    model.Comment.find({postId:req.params.id.toString()}).populate('userId').then(comments=>{
        if(comments.length !== 0){
            comments.reverse()
            res.send({errno:0,comments:comments})
        }else{
            res.send({errno:1})
        }
    }).catch(()=>{
        res.send({errno:2})
    })
}



