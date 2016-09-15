// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint-env mocha */

var subject = require('../lib/proxy');
var createServer = require('./helpers/server');
var assert = require('assert');
var http = require('http');
var https = require('https');

describe('proxy', function () {
  var server, req;

  beforeEach(function (done) {
    server = createServer(done);
  });

  afterEach(function (done) {
    server.teardown(done);
  });

  beforeEach(function () {
    req = new http.IncomingMessage;
    req.method = 'GET';
    req.url = '/';
    req.headers['connection'] = 'close';
  });

  it('proxies the request', function (done) {
    server.once('request', function (preq) {
      assert.equal(preq.method, req.method);
      assert.equal(preq.url, req.url);
      assert.equal(preq.headers.host, server.addr + ':' + server.port);
      done();
    });

    subject(req, [], server.host).catch(function (err) {
      done(err);
    });
  });

  it('overrides the host if one is set on the incoming request', function (done) {
    server.once('request', function (preq) {
      assert.equal(preq.headers.host, server.addr + ':' + server.port);
      done();
    });

    req.headers['host'] = 'A.N.OTHER'

    subject(req, [], server.host).catch(function (err) {
      done(err);
    });
  });

  it('proxies the request body', function (done) {
    var body = [
      new Buffer('a'),
      new Buffer('b'),
      new Buffer('c')
    ];

    server.once('request', function (_req) {
      var data = [];

      _req.on('data', function (buf) {
        data.push(buf);
      });

      _req.on('end', function () {
        assert.deepEqual(Buffer.concat(data), Buffer.concat(body));
        done();
      });
    });

    req.method = 'POST';

    subject(req, body, server.host).catch(function (err) {
      done(err);
    });
  });

  it('yields the response', function (done) {
    subject(req, [], server.host).then(function (res) {
      assert.equal(res.statusCode, 201);
      done();
    }).catch(function (err) {
      done(err);
    });
  });

});