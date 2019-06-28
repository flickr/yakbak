// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var http = require('http');

/**
 * Creates a test HTTP server.
 * @param {Function} done
 * @returns {http.Server}
 */

module.exports = function createServer(cb) {

  var server = http.createServer(function (req, res) {
    res.statusCode = 201;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Date', 'Sat, 26 Oct 1985 08:20:00 GMT');

    req.resume(); // consume the request body, if any

    req.on('end', function () {
      res.end('OK');
    });

  }).on('listening', function () {
    this.addr = 'localhost';
    this.port = this.address().port;

    this.host = 'http://' + this.addr + ':' + this.port;
  }).on('listening', function () {
    this.requests = [];
  }).on('close', function () {
    this.requests = [];
  }).on('request', function (req) {
    this.requests.push(req);
  });

  server.teardown = function (done) {
    this.close(done);
  };

  return server.listen(cb);

};
