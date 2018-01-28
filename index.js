var express = require('express');
var app = express();
var path = require('path');

// viewed at http://localhost:8080
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);

// GET method route
app.get('/login', function (req, res) {
    res.send('GET request for the login page');
  });

app.get('/fooddonor', function (req,res) {
    res.send('GET request for the food donor page');
});

app.get('/postfood', function (req,res) {
    res.send('GET request for the post food page');
});

app.get('/organization', function (req,res) {
    res.send('GET request for the charitable organization page');
});

app.get('/claimedfood', function (req,res) {
    res.send('GET request for the claimed food page');
});

  