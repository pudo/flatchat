var flatchat = angular.module('flatchat', []);

flatchat.controller('MessagesCtrl', function ($scope, $interval, $http) {
  $scope.messages = [];
  
  $interval(function() {
    $http.get('/messages').then(function(res) {
      $scope.messages = res.data.results;
      $scope.numMessages = res.data.total;
    });
  }, 200);
});


