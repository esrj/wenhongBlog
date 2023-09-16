module.exports = (req,res,next)=>{
    if(!res.locals.isAuthenticated){
        return res.redirect('/login')
    }
    next()
}

