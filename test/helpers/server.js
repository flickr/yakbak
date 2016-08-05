// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var http = require('http');

/**
 * Creates a test HTTP server.
 * @param {Function} done
 * @param {Function} reqHandler: an optional callback to customize how to handle the request
 * @returns {http.Server}
 */

module.exports = function createServer(done, reqHandler) {

  var server = http.createServer(function (req, res) {
    req.resume(); // consume the request body, if any

    req.on('end', function () {
      if (reqHandler) {
        reqHandler(req, res);
      } else {
        res.statusCode = 201;

        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Date', 'Sat, 26 Oct 1985 08:20:00 GMT');
        res.end('OK');
      }
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

  server.teardown = function (doneT) {
    this.close(doneT);
  };

  return server.listen(done);

};
