const model = require('../model/model')

exports.explore = (req,res,next) =>{
    model.Post.find().then(posts=>{
        return res.render('explore/explore',{
            posts:posts
        })
    })
}
