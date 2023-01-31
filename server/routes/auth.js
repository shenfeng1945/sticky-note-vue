var express = require("express");
var router = express.Router();
//处理oauth2相关的认证
var passport = require("passport");
var GitHubStrategy = require("passport-github").Strategy;
var jwt = require("jsonwebtoken");
var config = require("../config");

passport.serializeUser(function(user, done) {
  // console.log('---serializeUser---')
  // console.log(user)
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  // console.log('---deserializeUser---')
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: "b90db91c737315789772",
      clientSecret: "fb33f87e87a5af519f7700c18cc24128497d072b",
      callbackURL: "http://sticky-note-vue.onrender.com/oauth/redirect"
    },
    function(accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);
// router.get('/logout', function (req, res) {
//     req.session.destroy();
//     res.redirect('/sticky');
// })

router.get("/github", passport.authenticate("github"));

router.get(
  "/redirect",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function(req, res) {
    // req.session.user = {
    //     id: req.user.id,
    //     username: req.user.displayName || req.user.username,
    //     avatar: req.user._json.avatar_url,
    //     provider: req.user.provider
    // };
    const token = jwt.sign(
      {
        id: req.user.id,
        username: req.user.displayName || req.user.username,
        avatar: req.user._json.avatar_url,
        provider: req.user.provider
      },
      config.jwtSecret
    );
    // 利用中转站，该路由只处理token
    res.redirect(
      `https://shenfeng1945-sticky.netlify.com/#/setAuth?token=${token}`
    );
  }
);

module.exports = router;
