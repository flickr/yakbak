// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var subject = require('..');
var request = require('supertest');
var assert = require('assert');
var mock = require('mock-fs');
var fs = require('fs');

var yakbak;

beforeEach(function () {
  yakbak = subject(this.host, { dirname: '/tapes' });
});

describe('record', function () {

  beforeEach(function () {
    mock({ '/tapes': {} });
  });

  afterEach(function () {
    mock.restore();
  });

  it('proxies the request to the server', function (done) {
    var server = this.server;

    request(yakbak)
    .get('/record/1')
    .set('host', 'localhost:3001')
    .expect('X-Yakbak-Tape', '1a574e91da6cf00ac18bc97abaed139e')
    .expect('Content-Type', 'text/html')
    .expect(201, 'OK')
    .end(function (err) {
      assert.ifError(err);
      assert.equal(server.requests.length, 1);
      done();
    });
  });

  it('writes the tape to disk', function (done) {
    request(yakbak)
    .get('/record/2')
    .set('host', 'localhost:3001')
    .expect('X-Yakbak-Tape', '3234ee470c8605a1837e08f218494326')
    .expect('Content-Type', 'text/html')
    .expect(201, 'OK')
    .end(function (err) {
      assert.ifError(err);
      assert(fs.existsSync('/tapes/3234ee470c8605a1837e08f218494326.js'));
      done();
    });
  });

});

describe('playback', function () {

  beforeEach(function () {
    mock({
      '/tapes/305c77b0a3ad7632e51c717408d8be0f.js': [
        'var path = require("path");',
        'module.exports = function (req, res) {',
        '  res.statusCode = 201;',
        '  res.setHeader("content-type", "text/html")',
        '  res.setHeader("x-yakbak-tape", path.basename(__filename, ".js"));',
        '  res.end("YAY");',
        '}',
        ''
      ].join('\n')
    });
  });

  afterEach(function () {
    mock.restore();
  });

  it('does not make a request to the server', function (done) {
    var server = this.server;

    request(yakbak)
    .get('/playback/1')
    .set('host', 'localhost:3001')
    .expect('X-Yakbak-Tape', '305c77b0a3ad7632e51c717408d8be0f')
    .expect('Content-Type', 'text/html')
    .expect(201, 'YAY')
    .end(function (err) {
      assert.ifError(err);
      assert.equal(server.requests.length, 0);
      done();
    });

  });
});
