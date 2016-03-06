var express = require('express');
var fs = require('fs');
var app = express();

app.get('/', function (req, res) {
  res.send('ready'); //Signal for Unity code: "this server works"
});

app.get('/postecho', function (req, res) {
  res.send(req.body); //Signal for Unity code: "this server works"
});

app.listen(3000);