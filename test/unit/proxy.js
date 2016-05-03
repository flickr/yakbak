// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var subject = require('../../lib/proxy');
var assert = require('assert');
var http = require('http');

describe('proxy', function () {
  var req;

  beforeEach(function () {
    req        = new http.IncomingMessage;
    req.method = 'GET';
    req.url    = '/';
    req.headers['connection'] = 'close';
  });

  it('proxies the request', function (done) {
    var addr = this.addr;
    var port = this.port;

    this.server.once('request', function (preq) {
      assert.equal(preq.method, req.method);
      assert.equal(preq.url, req.url);
      assert.equal(preq.headers.host, addr + ':' + port);
      done();
    });

    subject(req, [], this.host).catch(function (err) {
      done(err);
    });
  });

  it('proxies the request body', function (done) {
    var body = [
      new Buffer('a'),
      new Buffer('b'),
      new Buffer('c')
    ];

    this.server.once('request', function (req) {
      var data = [];

      req.on('data', function (buf) {
        data.push(buf);
      });

      req.on('end', function () {
        assert.deepEqual(Buffer.concat(data), Buffer.concat(body));
        done();
      });
    });

    req.method = 'POST';

    subject(req, body, this.host).catch(function (err) {
      done(err);
    });
  });

  it('yields the response', function (done) {
    subject(req, [], this.host).then(function (res) {
      assert.equal(res.statusCode, 201);
      done();
    }).catch(function (err) {
      done(err);
    });
  });

});
