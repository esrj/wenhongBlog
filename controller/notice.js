const model = require("../model/model");
exports.notice = (req,res,next)=>{
    if(req.method === 'GET'){
        model.Notice.find({author:req.user}).then(notices=>{
            return res.render('notice/notice',{
                notices:notices.reverse()
            })
        })
    }else if(req.method === 'POST'){
        const image = req.body.image
        const content = req.body.content
        const type = req.body.type
        const url = req.body.url
        const author = req.user
        const notice = new model.Notice({image,content,type,url,author})
        notice.save()
        res.end()
    }
}
