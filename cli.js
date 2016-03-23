#!/usr/bin/env node

// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var http = require('http');
var path = require('path');
var PORT = 3000;

try {
  if (!process.argv[2]) {
    throw new Error('file is required');
  }

  http.createServer(require(path.resolve(process.argv[2])))
  .on('connection', function (socket) {
    console.log('* Connection from %s port %s',
      socket.remoteAddress, socket.remotePort);

    socket.on('close', function () {
      console.log('* Connection closed');
    });
  }).on('request', function (req, res) {
    console.log('< %s %s HTTP/%s', req.method, req.url, req.httpVersion);

    Object.keys(req.headers).forEach(function (name) {
      console.log('< %s: %s', name, req.headers[name]);
    });

    console.log('<');

    console.log('> HTTP/%s %s %s',
      req.httpVersion,
      res.statusCode,
      http.STATUS_CODES[res.statusCode]);

    Object.keys(res._headers).forEach(function (name) {
      console.log('> %s: %s', name, res._headers[name]);
    });

    console.log('>');
  }).listen(PORT, function () {
    console.log('Server listening on port %d', this.address().port);
  });
} catch (err) {
  console.warn('%s: %s', err.name, err.message);
  console.warn('Usage: yakbak <file>');
  process.exit(1);
}
