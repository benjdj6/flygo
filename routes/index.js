var express = require('express');
var request = require('request');
var airports = require('../data/airports.json');
var airlines = require('../data/airlines.json');

var router = express.Router();

var months = ["Jan", "Feb", "Mar", "Apr", "May",
  "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
        if(flights[i].LowestFare.AirlineCodes) {
          flights[i].LowestFare.AirlineName = flights[i].LowestFare.AirlineCodes[0];
          for(k = 0; k < airlines.length; ++k) {
            if(airlines[k].code == flights[i].LowestFare.AirlineCodes[0]) {
              flights[i].LowestFare.AirlineName = airlines[k].name;
              flights[i].LowestFare.Alliance = airlines[k].alliance;
              break;
            }
          }
          if(flights[i].DepartureDateTime) {
            var date = flights[i].DepartureDateTime.split('-');
            var year = date[0];
            var month = months[parseInt(date[1])-1];
            var day = ((date[2].split('')).slice(0,2)).join('');
            date = [day, month].join(', ');
            date = [date, year].join(' ');
            flights[i].DepartureDateText = date;
          }
        }
        else {
          flights[i].LowestFare.AirlineName = "Unknown";
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
