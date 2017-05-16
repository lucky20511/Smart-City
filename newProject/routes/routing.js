var express = require('express');
var router = express.Router();



exports.admin= function(request,response){
    res.render('moderator', { title: 'Administrator Page' });
}