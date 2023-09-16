const model = require("../model/model");
exports.search = (req,res,next) =>{
    if(req.method === 'POST'){
        const data = req.body.data
        model.User.find({ "email":{ $regex: data, $options: 'i'}} ).then(users=>{
            res.send({"errno": 0,users:users})
        })
    }
}

