const passport = require('passport');
const model = require("../model/model");
const GoogleStrategy = require('passport-google-oauth20').Strategy;


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    model.User.findById(id).then(user => {
        // 將用戶傳遞給 done
        done(null, user);
    }).catch(err => {
        done(err);
    });
});



passport.use(
    new GoogleStrategy(
        {
            clientID: '347464423661-u9qfvmc2v1n053j9u3lmakadbgc6o7pl.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://127.0.0.1:3000/auth/google/callback/', // 根據你的設置調整回調URL
        },
        (accessToken, refreshToken, profile, done) => {
            console.log(accessToken, refreshToken, profile, done)
            // 獲取 gmail
            console.log(profile.emails[0].value)

            model.User.findOne({email: profile.emails[0].value}).then(user=> {
                if(user !== null){
                    return done(null, user)
                }else{
                    const newUser = new model.User({
                        email: profile.emails[0].value,
                        password: 'google_allauth_login_MIeJervBIveEUHwefwefevFP(ENvfUwDEDowDE#WenofENFveWUPFfwefHWverIUFNE(ervrFYEHPFBUEIFfwefEO:NO:FNEwfefOF',
                    });
                    newUser.save().then(savedUser => {
                        return done(null, savedUser);
                    })
                }
            })
        }
    )
);

module.exports = passport
