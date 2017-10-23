var express = require('express');
var yakbak = require('./index.js');
var bodyParser = require('body-parser');

let services = yakbak('http://cst-dvweb-01.isqft.com/services', {
  dirname:  '/home/ubuntu/projects/mock-data/tapes',
});

let solrServicesProject = yakbak('http://dev-solr.bidclerk.com/project/', {
  dirname:  '/home/ubuntu/projects/mock-data/tapes/solr',
});

let solrServicesCompany = yakbak('http://dev-solr.bidclerk.com/company/', {
  dirname:  '/home/ubuntu/projects/mock-data/tapes/solr',
});


const app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  if(req.path.includes('login')){
    res.cookie('isqftAuth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJlbWFpbCI6InByZW1pdW0udGhyZWVAaXNxZnQuY29tIiwiaWF0IjoiMTUwODc2NzA0NC44ODg3IiwianRpIjoiNzEzNDY0ZjMtOWE4Ni00ZjNiLTg1OWUtNWJiYWIxNGQ4NTE0In0.gEoaPhOqiqMftj6tRR4FKEb15c1BeB2i93PcOH_udIqKBR1gPtZy8m6EXduYYORhr1qHYW9MAVSjYaiSMQ7v7g', {domain: ".isqft.com", expires: new Date(Date.now() + 30*24*60*60*60*1000), path: "/", httpOnly: true});
    res.redirect('http://adil.isqft.com:5076');
  }

  if(req.path.includes('//project/select')){
    solrServicesProject(req,res);
  }
  if(req.path.includes('//company/select')){
    solrServicesCompany(req,res);
  }
  else{
    services(req, res);
  }
}).listen(9999);
