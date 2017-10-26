var express = require('express');
var yakbak = require('./index.js');
var bodyParser = require('body-parser');
var mockRouter = require('./mock_router.js');

const app = express();
//app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json

app.use(function (req, res, next) {
  console.log(req.body);
  if(req.path.includes('login')){
    res.cookie('isqftAuth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6InByZW1pdW0udGhyZWVAaXNxZnQuY29tIiwiaWF0IjoiMTUwODc2NzA0NC44ODg3IiwianRpIjoiNzEzNDY0ZjMtOWE4Ni00ZjNiLTg1OWUtNWJiYWIxNGQ4NTE0In0.gEoaPhOqiqMftj6tRR4FKEb15c1BeB2i93PcOH_udIqKBR1gPtZy8m6EXduYYORhr1qHYW9MAVSjYaiSMQ7v7g', {domain: ".isqft.com", expires: new Date(Date.now() + 30*24*60*60*60*1000), path: "/", httpOnly: true});
    res.redirect('http://adil.isqft.com:5076');
  }else {
    mockRouter(req.path)(req,res);
  }
});


app.listen(9999, function() {

  console.log('Mock server running on 9999');
})
