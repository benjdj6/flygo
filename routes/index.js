var async = require('async');
var express = require('express');
var request = require('request');
var airports = require('../data/airports.json');
var airlines = require('../data/airlines.json');

var router = express.Router();

var months = ["Jan", "Feb", "Mar", "Apr", "May",
  "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function prices(destination, callback) {
  var options = {
    url: 'https://api.test.sabre.com/v1/historical/flights/fares',
    headers: {
      'Authorization' : process.env.SECRET
    },
    qs: {
      'origin' : destination.Origin,
      'destination' : destination.Destination.DestinationLocation,
      'earliestdeparturedate' : '2017-01-12', //Placeholder
      'latestdeparturedate' : '2017-01-12',
      'lengthofstay' : '7'
    }
  };
  request(options, function(err, res, body) {
    callback(err, body);
  });
}


function flightHandler(err, response, body) {
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
      }
      else {
        flights[i].LowestFare.AirlineName = "Unknown";
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
      flights[i].PricePerMile = parseFloat(flights[i].PricePerMile).toFixed(2);
      if(flights[i].LowestFare.Fare) {
        flights[i].LowestFareText = parseFloat(flights[i].LowestFare.Fare).toFixed(2);
      }
    }
    return flights;
  }
  else {
    console.log("here");
    return response.statusCode;
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flygo' });
});

/*GET most popular destinations over past 8 weeks from origin*/
router.get('/destinations/:origin', function(req, res, next) {
  var options = {
    url: 'https://api.test.sabre.com/v1/lists/top/destinations',
    headers: {
      'Authorization' : process.env.SECRET
    },
    qs: {
      'origin' : req.params.origin,
      'lookbackweeks' : 8,
      'topdestinations' : 30
    }
  };
  request(options, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      var destinations = (JSON.parse(response.body)).Destinations;
      for(i = 0; i < destinations.length; ++i) {
        if(!destinations[i].Destination.CityName) {
          destinations[i].Destination.CityName = destinations[i].Destination.MetropolitanAreaName;
        }
        destinations[i].Origin = (JSON.parse(body)).OriginLocation;
      }
      async.map(destinations, prices, function(err, result) {
        if(err) {
          return console.log(err);
        }
        console.log(result);
      });
      res.json(destinations);
    }
    else {
      res.json(response.statusCode);
    }
  });
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
    var result = flightHandler(err, response, body);
    console.log(result);
    res.json(result);
  });
});

module.exports = router;
