var express = require('express');
var requests = require('requests');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flygo' });
});

router.get('/flights/:origin', function(req, res, next) {
  res.json(req.params);
});

module.exports = router;
