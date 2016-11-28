var app = angular.module('flygo', []);

app.factory('flights', [function() {
  var o = {
    tickets: [
    {
      "CurrencyCode":"USD",
      "LowestNonStopFare": {
          "AirlineCodes":["DL"],
          "Fare":862.19
      },
      "PricePerMile":0.4,
      "LowestFare": {
          "AirlineCodes":["DL"],
          "Fare":862.19
      },
      "DestinationLocation":"ATL",
      "Distance":2135,
      "DepartureDateTime":"2016-11-27T00:00:00",
      "ReturnDateTime":"2016-12-04T00:00:00",
      "Links": [
          {
              "rel":"shop",
              "href":"https://api.test.sabre.com/v1/shop/flights?origin=SFO&destination=ATL&departuredate=2016-11-27&returndate=2016-12-04&pointofsalecountry=US"
          }
      ]
    },
    {
      "CurrencyCode":"USD",
      "LowestNonStopFare": {
          "AirlineCodes":["VX"],
          "Fare":758.2
      },
      "PricePerMile":0.46,
      "LowestFare": {
          "AirlineCodes":["AA"],
          "Fare":681.2
      },
      "DestinationLocation":"AUS",
      "Distance":1497,
      "DepartureDateTime":"2016-11-27T00:00:00",
      "ReturnDateTime":"2016-12-04T00:00:00",
      "Links": [
          {
              "rel":"shop",
              "href":"https://api.test.sabre.com/v1/shop/flights?origin=SFO&destination=AUS&departuredate=2016-11-27&returndate=2016-12-04&pointofsalecountry=US"
          }
      ]
    }]
  };

  //Sends request to Express API to get flights
  o.getFlights = function(query) {
    if(!query.origin) {
      alert("No origin defined");
      return;
    }
    console.log("request to get flights");
  };

  return o;
}]);

//Controller for index.html handles form
app.controller('MainCtrl', [
  '$scope',
  'flights',
  function($scope, flights) {
    $scope.flights = flights.tickets;
    $scope.continents = [];
    $scope.alliances = [
      "None",
      "OneWorld",
      "SkyTeam",
      "Star Alliance"
    ];
    $scope.getTickets = function() {
      flights.getFlights({
        origin: $scope.origin,
        budget: $scope.budget,
        alliance: $scope.alliance,
        depart: $scope.depart,
        return: $scope.return,
        layover: $scope.layover,
        domestic: $scope.domestic
      });
    };
  }
]);

