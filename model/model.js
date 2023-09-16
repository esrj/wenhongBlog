const mongodb = require('mongodb')
const mongoose = require('mongoose')
const {save} = require("debug");
const {isBoolean} = require("validator");

const User = new mongoose.Schema({
    image:{type: String, default:'picture/user.png'},
    info:{type:String, default: 'hello'},
    password: { type:String, required: true },
    email:{ type:String, require: true },
    resetToken :{type:String},
    resetTokenExpiration :{type:Date},
})

const Post = new mongoose.Schema({
    content :{type: String,require:false},
    date : {type: String ,require: true},
    image :{type: String , require: true},
    like :{type: Number,require:true,default: 0},
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    mark :{type: Boolean,require: true,default:false}
})

const Comment = new mongoose.Schema({
    content : {type:String,require:true},
    date:{type:String,require:true},
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        require:true
    }
})

const Follow = new mongoose.Schema({
    follower :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    followed : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    }
})

const Message = new mongoose.Schema({
    sender :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    receive :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    content : {type:String,require:true},
})

const Like = new mongoose.Schema({
    post :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        require: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require : true
    }
})

const Notice = new mongoose.Schema({
    image: {type:String,require:true},
    content: {type:String,require:true},
    type: {type:String,require:true},
    url: {type:String,require:true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require : true
    }
})

exports.User = mongoose.model('User',User)
exports.Post = mongoose.model('Post',Post)
exports.Comment = mongoose.model('Comment',Comment)
exports.Follow = mongoose.model('Follow',Follow)
exports.Message = mongoose.model('Message',Message)
exports.Like = mongoose.model('Like',Like)
exports.Notice = mongoose.model('Notice',Notice)
