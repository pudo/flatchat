var express = require('express'),
    messages = require('./messages'),
    _ = require('underscore'),
    async = require('async');
    

var app = express();
app.use(express.static(__dirname + '/static'));

messages.init();

app.get('/messages', function(req, res) {
  messages.traverse(25, 0, function(results, total) {
    async.map(results, messages.read, function(err, results) {
      var data = {'results': results, 'total': total};
      res.jsonp(data);
      //res.render('index', data);
    });
  });
});

app.get('/xx', function(req, res) {
  messages.traverse(25, 0, function(results, total) {
    async.map(results, messages.read, function(err, results) {
      var data = {'results': results, 'total': total};
      res.render('index', data);
    });
  });
});

app.listen(3000);

