var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'Administrator Page' });
});
// router.get('/', function(req, res, next) {
//     res.render('moderator', { title: 'Moderator Page' });
// });

router.get('/moderator', function(req, res, next) {
    res.render('moderator', { title: 'Moderator Page' });
});
router.get('/profile', function(req, res, next) {
    res.render('profile', { title: 'Profile' });
});
// router.get('/', function(req, res, next) {
//     res.render('moderator', { title: 'Moderator Page' });
// });
module.exports = router;