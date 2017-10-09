var express = require('express');
var yakbak = require('./index.js');
var bodyParser = require('body-parser');

let services = yakbak('http://cst-dvweb-01.isqft.com/services', {
  dirname:  '/home/ubuntu/projects/mock-data/tapes',
});

const app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  if(req.path.includes('login')){
    res.cookie('isqftAuth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6InByZW1pdW0udGhyZWVAaXNxZnQuY29tIiwiaWF0IjoiMTUwNjYxOTU3Ni44MDM2NCIsImp0aSI6ImFhNzcyNWNjLTcxYWMtNDFlNy05ZTRiLTUzNzNiMTg1OTI0YiJ9.MVo4Da3d-MyZccxrmcz0rev2EOPosijH9TSIVdOiGchUDhPyJZY_gkv-k0k3hr-3d4Xwo7Vp8L6roGxdUmWF0g', {domain: ".isqft.com", expires: new Date(Date.now() + 30*24*60*60*60*1000), path: "/", httpOnly: true});
    res.redirect('http://adil.isqft.com:5076');
  }else{
    services(req, res);
  }
}).listen(9999);
