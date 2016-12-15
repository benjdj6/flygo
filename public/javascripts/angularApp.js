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
    var destinationtype = "OVERALL";
    if(domestic) {
      destinationtype = "DOMESTIC";
    }
    return $http({
      method: 'GET',
      url: '/destinations/' + origin,
      params: {
        'departureDate' : departureDate,
        'triplength' : tripLength,
        'destinationtype' : destinationtype
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
        if(!$scope.destination && $scope.layover >= item.Layover) {
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
        if(item.DestinationLocation == $scope.destination 
            && $scope.layover >= item.Layover) {
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

