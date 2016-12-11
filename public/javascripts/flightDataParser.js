var airlines = require('../../data/airlines.json');

var airlineCodes = {};

//Finds the airline name and alliance and stores it into the flight object
function getAirline(itinerary, flight) {
  flight.Airline = itinerary.OriginDestinationOption[0].FlightSegment[0].MarketingAirline.Code;
  if(airlineCodes[flight.Airline]) {
    flight.Alliance = airlineCodes[flight.Airline].alliance;
    flight.Airline = airlineCodes[flight.Airline].name;
  }
  else {
    for(i = 0; i < airlines.length; ++i) {
      if(airlines[i].code == flight.Airline) {
        flight.Airline = airlines[i].name;
        flight.Alliance = airlines[i].alliance;
        
        airlineCodes[airlines[i].code] = {
          'name' : airlines[i].name,
          'alliance' : airlines[i].alliance
        };
        break;
      }
    }
  }
  return flight;
}

//Calculates the longest layover and stores it in the flight object
function getLayover(itinerary, flight) {
  var segments = itinerary.OriginDestinationOption[0].FlightSegment;
  flight.layover = 0;
  for(i = 1; i < segments.length; ++i) {
    var arrive = new Date(itinerary.OriginDestinationOption[0]
                          .FlightSegment[i - 1].ArrivalDateTime);
    var depart = new Date(itinerary.OriginDestinationOption[0]
                          .FlightSegment[i].DepartureDateTime);
    var layover = (depart - arrive) / 60000;
    if(layover > flight.layover) {
      flight.layover = layover;
    }
  }
  return flight;
}

//Creates flight object, assigns values to it, then returns an array of flight objects
exports.parseFlightData = function(destination, flights) {
  parsedData = []
  for(var key in flights) {
    flight = {
      'DestinationLocation' : destination.Destination.DestinationLocation,
      'CityName' : destination.Destination.CityName,
      'CountryName' : destination.Destination.CountryName,
      'Fare' : flights[key].AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount,
    }
    flight = getAirline(flights[key].AirItinerary.OriginDestinationOptions, flight);
    flight = getLayover(flights[key].AirItinerary.OriginDestinationOptions, flight);
    parsedData.push(flight);
  }

  return parsedData;
}