var app = angular.module('flygo', []);

app.factory('flights', ['$http', function($http) {
  var o = {
    tickets: []
  };

  //Sends request to Express API to get flights
  o.getFlights = function(query) {
    if(!query.origin) {
      alert("No origin defined");
      return;
    }
    return $http({
      method: 'GET',
      url: '/flights/' + query.origin
    }).success(function(data) {
      if(data == 404) {
        alert("No Results :(");
        return;
      }
      angular.copy(data, o.tickets);
    });

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
      "OneWorld",
      "SkyTeam",
      "Star Alliance"
    ];
    $scope.getTickets = function() {
      flights.getFlights({
        origin: $scope.origin,
        alliance: $scope.alliance,
        depart: $scope.depart,
        return: $scope.return,
        layover: $scope.layover,
        domestic: $scope.domestic
      });
    };
    $scope.filters = function() {
      return function(item) {
        if(!$scope.budget && !$scope.alliance) {
          return true;
        }
        if(!$scope.budget) {
          return item.LowestFare.Alliance == $scope.alliance;
        }
        if (!$scope.alliance) {
          return item.LowestFare.Fare <= $scope.budget;
        }
        return (item.LowestFare.Fare <= $scope.budget && item.LowestFare.Alliance == $scope.alliance);
      }
    }
  }
]);

