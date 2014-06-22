var express = require('express'),
    _ = require('underscore');


var app = express();


init();

app.get('/hello.txt', function(req, res) {
  res.json({'message': 'Hello World'});
});

app.listen(3000);

