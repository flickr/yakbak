// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint-env mocha */

var subject = require('../lib/record');
var createServer = require('./helpers/server');
var createTmpdir = require('./helpers/tmpdir');
var assert = require('assert');
var http = require('http');
var fs = require('fs');

var fixture = require('./fixtures');

describe('record', function () {
  var server, tmpdir, req;

  afterEach(function (done) {
    server.teardown(done);
  });

  beforeEach(function (done) {
    tmpdir = createTmpdir(done);
  });

  afterEach(function (done) {
    tmpdir.teardown(done);
  });

  describe('filename', function () {
    beforeEach(function (done) {
      server = createServer(done);
    });

    beforeEach(function () {
      req = http.request({
        host: server.addr,
        port: server.port
      });
      req.setHeader('User-Agent', 'My User Agent/1.0');
      req.setHeader('Connection', 'close');
    });

    it('returns the filename', function (done) {
      req.on('response', function (res) {
        subject(req, res, tmpdir.join('foo.js')).then(function (filename) {
          assert.equal(filename, tmpdir.join('foo.js'));
          done();
        }).catch(function (err) {
          done(err);
        });
      });

      req.end();
    });
  });

  describe('template rendering', function () {
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

    describe('when the body is not human readable', function () {
      it('records the response to disk using base64', function (done) {
        function requestHandler(request, response) {
          response.statusCode = 201;
          response.setHeader('Content-Type', 'image/gif');
          response.setHeader("date", "Sat, 26 Oct 1985 08:20:00 GMT");
          response.end('GIF');
        }

        makeRequest(requestHandler, function (res) {
          var expected = fixture('base64').replace('{addr}', server.addr).replace('{port}', server.port);

          subject(res.req, res, tmpdir.join('foo.js')).then(function (filename) {
            assert.equal(fs.readFileSync(filename, 'utf-8'), expected);
            done();
          });
        });
      });
    });

    describe('when the body is human readable', function () {
      it('records the response to disk using utf-8', function (done) {
        function requestHandler(request, response) {
          response.statusCode = 201;
          response.setHeader('Content-Type', 'text/html');
          response.setHeader("date", "Sat, 26 Oct 1985 08:20:00 GMT");
          response.end('OK');
        }

        makeRequest(requestHandler, function (res) {
          var expected = fixture('utf8').replace('{addr}', server.addr).replace('{port}', server.port);

          subject(res.req, res, tmpdir.join('foo.js')).then(function (filename) {
            assert.equal(fs.readFileSync(filename, 'utf-8'), expected);
            done();
          });
        });
      });
    });
  });
});
