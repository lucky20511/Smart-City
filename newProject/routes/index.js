var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Administrator Page' });
});
// router.get('/', function(req, res, next) {
//     res.render('moderator', { title: 'Moderator Page' });
// });

router.get('/moderator', function(req, res, next) {
    req.session.type = "moderator";
    res.render('moderator', { title: 'Moderator Page' });
});
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Profile',type:req.session.type});
});
router.get('/admin', function(req, res, next) {
    req.session.type = "admin";
    res.render('admin', { title: 'Login' });
});

// router.get('/', function(req, res, next) {
//     res.render('moderator', { title: 'Moderator Page' });
// });
module.exports = router;