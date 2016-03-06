var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!<br>This is a test!');
});

app.listen(3000);