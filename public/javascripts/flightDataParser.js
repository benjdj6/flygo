var airlines = require('../../data/airlines.json');
var airports = require('../../data/airports.json');

//Finds the airline name and alliance and stores it into the flight object
function getAirline(itinerary, flight) {
  flight.Airline = itinerary.OriginDestinationOption[0].FlightSegment[0].MarketingAirline.Code;
  
  if(airlines[flight.Airline]) {
    flight.Alliance = airlines[flight.Airline].alliance;
    flight.Airline = airlines[flight.Airline].name;
  }
  else {
    flight.Alliance = "N/A"
  }

  return flight;
}

function convertDate(date) {
  var result = date.toDateString() + " " + date.toTimeString();
  result = result.split(' ');
  result = result.slice(0, 5);
  result[4] = result[4].slice(0, 5);
  result.push((date.toTimeString()).split(' ')[2]);
  return result.join(' ');
}

//Calculates the longest layover and gets the first departure and last
//arrival times of the trip and stores them
function getTimes(itinerary, flight) {
  var segments = itinerary.OriginDestinationOption[0].FlightSegment;
  var depart = new Date(itinerary.OriginDestinationOption[0]
                          .FlightSegment[0].DepartureDateTime);

  var arrive = new Date(itinerary.OriginDestinationOption[0]
                          .FlightSegment[0].ArrivalDateTime);

  flight.DepartureDate = convertDate(depart);
  flight.ArrivalDate = convertDate(arrive);

  flight.Layover = 0;
  for(i = 1; i < segments.length; ++i) {
    arrive = new Date(itinerary.OriginDestinationOption[0]
                          .FlightSegment[i - 1].ArrivalDateTime);
    depart = new Date(itinerary.OriginDestinationOption[0]
                          .FlightSegment[i].DepartureDateTime);
    var layover = (depart - arrive) / 60000;

    if(layover > flight.Layover) {
      flight.Layover = layover;
    }

    flight.ArrivalDate = convertDate(arrive);
  }
  return flight;
}

//Creates flight object, assigns values to it, then returns an array of flight objects
exports.parseFlightData = function(destination, flights) {
  parsedData = []

  var destinationName = destination.Destination.CityName + ', ' + destination.Destination.CountryName;

  var originCountry = (airports[destination.Origin].location.split(','))[1].slice(1);

  var domestic = false;
  if(originCountry == destination.Destination.CountryName) {
    domestic = true;
  }

  for(var key in flights) {
    //Initial properties added, RawFare included due to Angular's orderBy handling floats poorly
    flight = {
      'DestinationLocation': destination.Destination.DestinationLocation,
      'DestinationName': destinationName,
      'RawFare': flights[key].AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount * 100,
      'Fare': flights[key].AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount,
      'Domestic': domestic
    };
    flight = getAirline(flights[key].AirItinerary.OriginDestinationOptions, flight);
    flight = getTimes(flights[key].AirItinerary.OriginDestinationOptions, flight);
    parsedData.push(flight);
  }

  return parsedData;
}