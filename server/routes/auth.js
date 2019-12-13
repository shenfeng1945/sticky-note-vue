var express = require('express')
var router = express.Router()
//处理oauth2相关的认证
var passport = require('passport')
var GitHubStrategy = require('passport-github').Strategy;
var jwt = require('jsonwebtoken')
var config = require('../config')

passport.serializeUser(function (user, done) {
    // console.log('---serializeUser---')
    // console.log(user)
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    // console.log('---deserializeUser---')
    done(null, obj);
});

passport.use(new GitHubStrategy({
    clientID: 'b90db91c737315789772',
    clientSecret: '428c4114c21058405e1381f55099e3e22b9909df',
    callbackURL: "https://shenfeng1945.cn:6060/auth/github/callback"
},
    function (accessToken, refreshToken, profile, done) {
        done(null, profile);
    }
));
// router.get('/logout', function (req, res) {
//     req.session.destroy();
//     res.redirect('/sticky');
// })

router.get('/github',
    passport.authenticate('github'));

router.get('/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // req.session.user = {
        //     id: req.user.id,
        //     username: req.user.displayName || req.user.username,
        //     avatar: req.user._json.avatar_url,
        //     provider: req.user.provider
        // };
        const token = jwt.sign({
            id: req.user.id,
            username: req.user.displayName || req.user.username,
            avatar: req.user._json.avatar_url,
            provider: req.user.provider
        },config.jwtSecret)
        // 利用中转站，该路由只处理token
        res.redirect(`https://shenfeng1945-sticky.netlify.com/#/setAuth?token=${token}`);
    });


module.exports = router;