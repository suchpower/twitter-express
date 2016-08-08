var express = require('express');
//var session = require('express-session');
var router = express.Router();
var app = express();

console.log('Welcome to the Twitter Express!');

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitter Express'});
});

module.exports = router;
