var express = require('express'),
    messages = require('./messages'),
    _ = require('underscore'),
    expressHbs = require('express3-handlebars');
    

var app = express();
app.use(express.static(__dirname + '/static'));
hbs = expressHbs({extname:'hbs', defaultLayout:'main.hbs'});
app.engine('hbs', hbs);
app.set('view engine', 'hbs');

messages.init();

app.get('/', function(req, res) {
  res.render('index');
});

app.listen(3000);

