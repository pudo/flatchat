var express = require('express'),
    messages = require('./messages'),
    async = require('async'),
    bodyParser = require('body-parser')
    

var app = express();
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.json())

messages.init();

app.get('/messages', function(req, res) {
  messages.traverse(25, 0, function(results, total) {
    async.map(results, messages.read, function(err, results) {
      var data = {'results': results, 'total': total};
      res.jsonp(data);
    });
  });
});

app.post('/messages', function(req, res) {
  var message = req.body;
  message.created_at = new Date();
  messages.create(message, function(id) {
    message.id = id;
    res.jsonp(message);
  });
});

app.listen(3000);

