// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var subject = require('../lib/record');
var createServer = require('./helpers/server');
var assert = require('assert');
var http = require('http');
var fs = require('fs');

var fixture = require('./fixtures');

describe('record', function () {
  var server, req;

  beforeEach(function (done) {
    server = createServer(done);
  });

  afterEach(function (done) {
    server.teardown(done);
  });

  beforeEach(function () {
    req = http.request({
      host: server.addr,
      port: server.port,
    });
    req.setHeader('User-Agent', 'My User Agent/1.0')
    req.setHeader('Connection', 'close');
  });

  it('returns the filename', function (done) {
    var tmpdir = this.tmpdir;

    req.on('response', function (res) {
      subject(req, res, tmpdir + '/foo.js').then(function (filename) {
        assert.equal(filename, tmpdir + '/foo.js');
        done();
      }).catch(function (err) {
        done(err);
      });
    });

    req.end();
  });

  it('records the response to disk', function (done) {
    var tmpdir = this.tmpdir;

    var expected = fixture.replace('{addr}', server.addr).replace('{port}', server.port);

    req.on('response', function (res) {
      subject(req, res, tmpdir + '/foo.js').then(function (filename) {
        assert.equal(fs.readFileSync(filename, 'utf8'), expected);
        done();
      }).catch(function (err) {
        done(err);
      });
    });

    req.end();
  });

});
