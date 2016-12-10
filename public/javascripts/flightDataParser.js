var airlines = require('../../data/airports.json');

var airlineCodes = {};

function getAirline(itinerary, flight) {
  flight.Airline = itinerary.OriginDestinationOption[0].FlightSegment[0].MarketingAirline.Code;
  if(airlineCodes[flight.Airline]) {
    flight.Airline = airlineCodes[flight.Airline].name
    flight.Alliance = airlineCodes[flight.Airline].alliance
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

function getLayover(itinerary, flight) {
  //DO THINGS
  return flight;
}

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
    parsedData.push(flight);
    console.log(flights[key].AirItinerary.OriginDestinationOptions.OriginDestinationOption[0].FlightSegment[0].MarketingAirline.Code);
  }

  return parsedData;
}