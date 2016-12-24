var app = angular.module('flygo', ['ui.unique']);

//Contains destination/flight data and relevant functions
app.factory('flights', ['$http', function($http) {
  var o = {
    destinations: []
  };

  o.getDestinations = function(origin, departureDate, tripLength, domestic) {
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

// Controller for index.html handles form
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
    $scope.domestic = false;

    $scope.getDestinations = function() {
      flights.getDestinations($scope.origin, $scope.depart,
                              $scope.triplength, $scope.domestic);
    };

    $scope.filters = function() {
      return function(item) {
        if($scope.domestic && !item.Domestic) {
          return false;
        }
        if($scope.destination && $scope.destination != item.DestinationLocation) {
          return false;
        }
        if($scope.budget && $scope.budget < item.Fare) {
          return false;
        }
        if($scope.alliance && item.Alliance != $scope.alliance) {
          return false;
        }
        if($scope.layover < item.Layover) {
          return false;
        }
        return true;
      };
    };

    $scope.showDestination = function(destination) {
      $scope.destination = destination;
      $scope.selected = true;
    }
  }
]);

