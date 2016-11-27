var app = angular.module('flygo', []);

app.factory('flights', [function() {
  var o = {
    tickets: []
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

