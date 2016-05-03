// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var http = require('http');

beforeEach(function (done) {
  this.server = http.createServer(function (req, res) {
    res.statusCode = 201;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Date', 'Sat, 26 Oct 1985 08:20:00 GMT');

    req.on('data', function (data) {
      // consume the request body, if any
    });

    req.on('end', function () {
      res.end('OK');
    });

  }).on('listening', function () {
    this.requests = [];
  }).on('close', function () {
    this.requests = [];
  }).on('request', function (req) {
    this.requests.push(req);
  }).listen(done);
});

beforeEach(function () {
  this.addr = 'localhost';
  this.port = this.server.address().port;

  this.host = 'http://' + this.addr + ':' + this.port;
});

afterEach(function (done) {
  this.server.close(done);
});

var tmpdir = require('os-tmpdir');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');

beforeEach(function () {
  this.tmpdir = path.join(tmpdir(), String(Date.now()));
});

beforeEach(function (done) {
  mkdirp(this.tmpdir, done);
});

afterEach(function (done) {
  rimraf(this.tmpdir, done);
});
