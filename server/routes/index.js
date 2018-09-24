var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let loginData = {
    isLogin:false,
  }
  if (req.session.user) {
    loginData = {
      isLogin: true,
      user: {
        avatar: req.session.user.avatar,
        username: req.session.user.username,
      },
    }
  }

  res.render('index', loginData);
});

module.exports = router;