var async = require('async');
var express = require('express');
var request = require('request');
var airports = require('../data/airports.json');
var airlines = require('../data/airlines.json');
var parser = require('../public/javascripts/flightDataParser');

var router = express.Router();

var months = ["Jan", "Feb", "Mar", "Apr", "May",
  "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


function getFares(destination, callback) {
  var options = {
    url: 'https://api.test.sabre.com/v1/shop/flights',
    headers: {
      'Authorization' : process.env.SECRET
    },
    qs: {
      'origin' : destination.Origin,
      'destination'  : destination.Destination.DestinationLocation,
      'departuredate' : destination.DepartureDate,
      'returndate' : destination.ReturnDate,
      'sortby' : 'totalfare',
      'order' : 'asc',
      'sortby2' : 'elapsedtime',
      'order2' : 'asc',
      'limit' : 50
    }
  };
  request(options, function(err, res, body) {
    var flights = null;
    if(!err) {
      flights = (JSON.parse(res.body)).PricedItineraries;
      flights = parser.parseFlightData(destination, flights);
    }
    callback(err, flights);
  });
}

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Flygo' });
});

// GET most popular destinations over past 8 weeks from origin
router.get('/destinations/:origin', function(req, res, next) {
  var options = {
    url: 'https://api.test.sabre.com/v1/lists/top/destinations',
    headers: {
      'Authorization' : process.env.SECRET
    },
    qs: {
      'origin' : req.params.origin,
      'destinationtype' : req.query.destinationtype,
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
        var departdate = new Date(req.query.departureDate);
        var returndate = departdate.getTime() + (86400000 * req.query.triplength);
        returndate = new Date(returndate);
        destinations[i].DepartureDate = (((departdate.toISOString()).split('')).slice(0, 10)).join('');
        destinations[i].ReturnDate = (((returndate.toISOString()).split('')).slice(0, 10)).join('');
      }

      async.map(destinations, getFares, function(err, flights) {
        if(err) {
          return console.log(err);
        }
        var trips = [];
        //iterate through returned flight arrays and add them to trips
        //if flight is undefined then remove from array
        for(i = 0; i < flights.length; ++i) {
          if(flights[i] == undefined) {
            flights.splice(i, 1);
            --i;
          }
          else {
            for(j = 0; j < flights[i].length; ++j) {
              trips.push(flights[i][j]);
            }
          }
        }
        res.json(trips);
      });
    }
    else {
      res.json(response.statusCode);
    }
  });
});

module.exports = router;
