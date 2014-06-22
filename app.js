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

app.post('/messages', function(req, res, next) {
  var message = {
    author: req.body.author,
    text: req.body.text,
    created_at: new Date()
  };
  if (!message.author || message.author.length < 3) {
    res.status(400);
    res.jsonp({'error': "No 'author' is set!"});
  } else if (!message.text || message.text.length == 0) {
    res.status(400);
    res.jsonp({'error': "No 'text' is set!"});
  } else {
    messages.create(message, function(id) {
      message.id = id;
      res.jsonp(message);
    });
  }
});

app.listen(3000);

