var flatchat = angular.module('flatchat', ['ngCookies']);

flatchat.controller('MessagesCtrl', function ($scope, $interval, $http, $cookies) {
  $scope.messages = [];
  $scope.hasAuthor = false;
  $scope.authorName = '';

  if (typeof $cookies.authorName !== 'undefined') {
    $scope.hasAuthor = true;
    $scope.authorName = $cookies.authorName;
  }

  $scope.setAuthor = function() {
    $scope.hasAuthor = true;
    $cookies.authorName = $scope.authorName;
  };

  $scope.sendMessage = function() {
    var message = {
      author: $scope.authorName,
      text: $scope.newMessage
    };

    $http.post('/messages', message);
    $scope.newMessage = "";

    var inputMessage = document.getElementById('new-message');
    inputMessage.focus();
  }
  
  $interval(function() {
    $http.get('/messages').then(function(res) {
      $scope.messages = res.data.results.reverse();
      $scope.numMessages = res.data.total;
    });
  }, 200);
});
