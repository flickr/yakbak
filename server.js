var express = require('express');
var yakbak = require('./index.js');
var bodyParser = require('body-parser');

let services = yakbak('http://cst-dvweb-01.isqft.com/services', {
  //dirname: __dirname + '/tapes',
  dirname:  '/tmp/tapes',
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  services(req, res);
}).listen(9999);
