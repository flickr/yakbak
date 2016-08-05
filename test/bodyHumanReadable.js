// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint-env mocha */

var subject = require('../lib/bodyHumanReadable');
var createServer = require('./helpers/server');
var assert = require('assert');
var http = require('http');

describe('bodyHumanReadable', function () {
  var server, req;

  afterEach(function (done) {
    server.teardown(done);
  });

  function makeRequest(requestHandler, test) {
      server = createServer(function () {
        req = http.request({
          host: server.addr,
          port: server.port
        });
        req.setHeader('User-Agent', 'My User Agent/1.0');
        req.setHeader('Connection', 'close');

        req.on('response', test);
        req.end();
      }, requestHandler);
  }

  describe("when content-type is human readable", function () {
    it("returns true when content-encoding is not set", function (done) {
      function requestHandler(request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end('<html></html>');
      }

      makeRequest(requestHandler, function (response) {
        assert(subject(response));
        done();
      });
    });

    it("returns true when content-encoding is set to identity", function (done) {
      function requestHandler(request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.setHeader('Content-Encoding', 'identity');
        response.end('<html></html>');
      }

      makeRequest(requestHandler, function (response) {
        assert(subject(response));
        done();
      });
    });

    it("returns false when content-encoding is set to gzip", function (done) {
      function requestHandler(request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.setHeader('Content-Encoding', 'gzip');
        response.end('ZIP');
      }

      makeRequest(requestHandler, function (response) {
        assert(!subject(response));
        done();
      });
    });
  });

  describe("when content-type is not human readable", function () {
    it("returns false", function (done) {
      function requestHandler(request, response) {
        response.statusCode = 200;
        response.setHeader('Content-Type', 'image/gif');
        response.end('GIF');
      }

      makeRequest(requestHandler, function (response) {
        assert(!subject(response));
        done();
      });
    });
  });

  describe("when there's no content-type", function () {
    it('returns false', function (done) {
      function requestHandler(request, response) {
        response.statusCode = 304;
        response.end('OK');
      }

      makeRequest(requestHandler, function (response) {
        assert(!subject(response));
        done();
      });
    });
  });
});
