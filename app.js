const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const model = require('./model/model')
const csrf = require('csurf')
const compression = require('compression')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(compression())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 添加 image 上傳的路由層
app.use('/image',express.static(path.join(__dirname, 'image')));

// database
const mongoose = require('mongoose')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const store = new MongoDBStore({
    url:'mongodb://localhost',
    databaseName: 'nodeproj4',
    collection:'sessions'
})
app.use(
    session({
        secret:'random secret string',
        cookie:{
            httpOnly:true
        },
        store:store,
        resave: false,
        saveUninitialized: true,
    })
)
// database connect
mongoose.connect('mongodb://localhost:27017/nodeproj4',{ useNewUrlParser: true })

const multer = require('multer')
const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'image')
    },
    filename:function (req,file,cb){
        const uniquePrefix = Date.now()
        cb(null,uniquePrefix+'_'+file.originalname)
    }
})
const fileFilter = (req,file,cb)=>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null,true)
    }else{
        cb(null,false)
    }
}
app.use(multer({storage,fileFilter}).single('image'))

//中間件設定
app.use(csrf())
app.use((req,res,next)=>{
    // res.locals.isAuthenticated = req.session.isLogin;
    res.locals.csrfToken = req.csrfToken()
    // 登入權限設定
    if(req.session.passport){
        model.User.findOne({_id:req.session.passport.user.toString()}).then(user=>{
            if(user){
                res.locals.isAuthenticated = true
                res.locals.user = user
                req.user = user
                next()
            }else{
                res.locals.isAuthenticated = false
                next()
            }
        })
    }else if(!req.session.user){
        res.locals.isAuthenticated = false
        next()
    }else{
        res.locals.isAuthenticated = true
        model.User.findOne({email:req.session.user.email}).then(user=>{
            res.locals.user = user
            req.user = user
            next()
        })
    }
})
const transporter = require('./google/mail')
const passport = require('./google/allauth');
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback/', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {


        const options = {
            from: 'wenhongli0510@gmail.com',
            to: req.user.email,
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
                console.log(error)
            }
        });

        res.redirect('/');
    }
);

const mainRouter = require('./routes/main');
const blogRouter = require('./routes/blog')
const profileRouter = require('./routes/profile')
const noticeRouter = require('./routes/notice')
const searchRouter = require('./routes/search')
const msgRouter = require('./routes/msg')
const exploreRouter = require('./routes/explore')
app.use('/', mainRouter);
app.use('/',blogRouter)
app.use('/',profileRouter)
app.use('/',noticeRouter)
app.use('/',searchRouter)
app.use('/',msgRouter)
app.use('/',exploreRouter)

const error = require('./controller/error')
app.use(error.not_found);




module.exports = app;
