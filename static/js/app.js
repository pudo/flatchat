var flatchat = angular.module('flatchat', ['ngCookies']);

var COLORS = [
    "#CF3D1E", "#F15623", "#F68B1F", "#FFC60B", "#DFCE21",
    "#BCD631", "#95C93D", "#48B85C", "#00833D", "#00B48D", 
    "#60C4B1", "#27C4F4", "#478DCB", "#3E67B1", "#4251A3", "#59449B", 
    "#6E3F7C", "#6A246D", "#8A4873", "#EB0080", "#EF58A0", "#C05A89"
    ];

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var nameColor = function(name) {
  var code = name.hashCode(),
      col = code % COLORS.length;
  return COLORS[col];
};

flatchat.controller('MessagesCtrl', function ($scope, $interval, $http, $cookies) {
  $scope.messages = [];
  $scope.hasAuthor = false;
  $scope.authorName = '';

  if (typeof $cookies.authorName !== 'undefined') {
    $scope.hasAuthor = true;
    $scope.authorName = $cookies.authorName;
  }

  var focus = function() {
    var inputMessage = document.getElementById('new-message');
    inputMessage.focus();
  }

  $scope.setAuthor = function() {
    $scope.hasAuthor = true;
    $cookies.authorName = $scope.authorName;
    focus();
  };

  $scope.sendMessage = function() {
    var message = {
      author: $scope.authorName,
      text: $scope.newMessage
    };

    $http.post('/messages', message);
    $scope.newMessage = "";
    focus();
  }
  
  $interval(function() {
    $http.get('/messages').then(function(res) {
      $scope.messages = res.data.results.reverse();
      $scope.messages.forEach(function(m) {
        m.ts = moment(m.created_at).format('LT');
        m.mine = m.author == $scope.authorName;
        m.color = nameColor(m.author);
      });
      $scope.numMessages = res.data.total;
    });
  }, 200);
  
  focus();
});
