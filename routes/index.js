var express = require('express');
var request = require('request');
var airports = require('../data/airports.json');

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
      'maxfare': req.query.maxfare,
      'lengthofstay': 7
    }
  };
  request(options, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      var flights = (JSON.parse(response.body)).FareInfo;
      for(i = 0; i < flights.length; ++i) {
        for(j = 0; j < airports.length; ++j) {
          if(airports[j].code == flights[i].DestinationLocation) {
            flights[i].DestinationLocation = airports[j].location;
            break;
          }
        }
      }
      res.json(flights);
    }
    else {
      res.json(response.statusCode);
    }
  });
});

module.exports = router;
