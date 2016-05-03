// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var subject = require('../../lib/record');
var assert = require('assert');
var http = require('http');
var fs = require('fs');

var fixture = require('../fixtures');

describe('record', function () {
  var req;

  beforeEach(function () {
    req = http.request({
      host: this.addr,
      port: this.port,
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
    var addr = this.addr;
    var port = this.port;

    var expected = fixture.replace('{addr}', addr).replace('{port}', port);

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
