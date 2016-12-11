var app = angular.module('flygo', ['ui.unique']);

app.factory('flights', ['$http', function($http) {
  var o = {
    destinations: []
  };

  o.getDestinations = function(origin, departureDate, tripLength) {
    if(!origin || !departureDate) {
      alert("Origin or departure date is missing!");
      return;
    }
    return $http({
      method: 'GET',
      url: '/destinations/' + origin,
      params: {
        'departureDate' : departureDate,
        'triplength' : tripLength
      }
    }).success(function(data) {
      if(data == 404) {
        return alert("No Results :(");
      }
      angular.copy(data, o.destinations);
    });
  };

  return o;
}]);

//Controller for index.html handles form
app.controller('MainCtrl', [
  '$scope',
  'flights',
  function($scope, flights) {
    $scope.destinations = flights.destinations;
    $scope.continents = [];
    $scope.destination = "";
    $scope.selected = false;
    $scope.alliances = [
      "OneWorld",
      "SkyTeam",
      "Star Alliance"
    ];

    $scope.getDestinations = function() {
      flights.getDestinations($scope.origin, $scope.depart, $scope.triplength);
    };

    $scope.filters = function() {
      return function(item) {
        if(!$scope.destination) {
          if(!$scope.budget && !$scope.alliance) {
            return true;
          }
          if(!$scope.budget) {
            return item.Alliance == $scope.alliance;
          }
          if (!$scope.alliance) {
            return item.Fare <= $scope.budget;
          }
          return (item.Fare <= $scope.budget && item.Alliance == $scope.alliance);
        }
        if(item.DestinationLocation == $scope.destination) {
          if(!$scope.budget && !$scope.alliance) {
            return true;
          }
          if(!$scope.budget) {
            return item.Alliance == $scope.alliance;
          }
          if (!$scope.alliance) {
            return item.Fare <= $scope.budget;
          }
          return (item.Fare <= $scope.budget && item.Alliance == $scope.alliance);
        }
      };
    };

    $scope.showDestination = function(destination) {
      $scope.destination = destination;
      $scope.selected = true;
    }
  }
]);

