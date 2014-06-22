var express = require('express'),
    _ = require('underscore');

var DATA_PATH = process.env.DATA_PATH;

var app = express();

var init = function() {
  if (_.isUndefined(DATA_PATH)) {
    console.log("You haven't set a DATA_PATH environment variable!");
  }
};

init();

app.get('/hello.txt', function(req, res) {
  res.json({'message': 'Hello World'});
});

app.listen(3000);

