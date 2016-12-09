var app = angular.module('flygo', ['ui.unique']);

app.factory('flights', ['$http', function($http) {
  var o = {
    destinations: [],
    tickets: []
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
      console.log(data);
      angular.copy(data, o.destinations);
    });
  };

  //Sends request to Express API to get flights
  o.getFlights = function(query) {
    if(!query.origin) {
      alert("No origin defined!");
      return;
    }
    return $http({
      method: 'GET',
      url: '/flights/' + query.origin,
      qs: {
        'departureDate' : query.depart
      }
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

    $scope.getTickets = function() {
      flights.getFlights({
        origin: $scope.origin,
        alliance: $scope.alliance,
        depart: $scope.depart,
        triplength: $scope.triplength,
        layover: $scope.layover,
        domestic: $scope.domestic
      });
    };

    $scope.filters = function() {
      return function(item) {
        if(!$scope.destination) {
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
        if(item.DestinationLocation == $scope.destination) {
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
      };
    };

    $scope.showDestination = function(destination) {
      $scope.destination = destination;
      $scope.selected = true;
    }
  }
]);

