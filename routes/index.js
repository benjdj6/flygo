var express = require('express');
var request = require('request');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flygo' });
});

/* GET destinations from origin with 7 day stay */
router.get('/flights/:origin', function(req, res, next) {
  var options = {
    url: 'https://api.test.sabre.com/v2/shop/flights/fares',
    headers: {
      'Authorization' : process.env.SECRET
    },
    qs: {
      'origin': req.params.origin,
      'lengthofstay': 7
    }
  };
  request(options, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      console.log("here");
      res.json(response);
    }
  });
});

module.exports = router;
