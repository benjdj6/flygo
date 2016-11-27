var app = angular.module('flapperNews', []);

app.factory('flights', [function() {
  var o = {
    tickets: []
  };

  //Sends request to Express API to get flights
  o.getFlights = function(search) {
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
    $scope.getTickets = function() {
      flights.getFlights($scope.search);
    };
  };
]);

