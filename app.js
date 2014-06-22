var express = require('express'),
    fs = require('fs'),
    _ = require('underscore');

var DATA_PATH = process.env.DATA_PATH,
    MSG_PATH = null;

var app = express();

var init = function() {
  if (_.isUndefined(DATA_PATH)) {
    console.log("You haven't set a DATA_PATH environment variable!");
  }

  // Create necessary paths:
  if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
  }
  MSG_PATH = DATA_PATH + '/messages';
  if (!fs.existsSync(MSG_PATH)) {
    fs.mkdirSync(MSG_PATH);
  }
};

init();

app.get('/hello.txt', function(req, res) {
  res.json({'message': 'Hello World'});
});

app.listen(3000);

