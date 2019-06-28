#!/usr/bin/env node

// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint no-console:"off" */

var http = require('http');
var path = require('path');
var curl = require('./lib/curl');
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
    console.log(curl.request(req));
    console.log(curl.response(req, res));
  }).listen(PORT, function () {
    console.log('Server listening on port %d', this.address().port);
  });
} catch (err) {
  console.warn('%s: %s', err.name, err.message);
  console.warn('Usage: yakbak <file>');
  process.exit(1);
}
