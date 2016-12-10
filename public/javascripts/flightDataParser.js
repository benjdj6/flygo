exports.parseFlightData = function(destination, flights) {
  for(var key in flights) {
    flights[key].DestinationLocation = destination.Destination.DestinationLocation;
    flights[key].CityName = destination.Destination.CityName;
    flights[key].CountryName = destination.Destination.CountryName;
    flights[key].Fare = flights[key].AirItineraryPricingInfo.ItinTotalFare.TotalFare.Amount;
  }

  return flights;
}