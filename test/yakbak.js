// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint-env mocha */

var subject = require('..');
var createServer = require('./helpers/server');
var createTmpdir = require('./helpers/tmpdir');
var request = require('supertest');
var assert = require('assert');
var fs = require('fs');
var crypto = require('crypto');
var url = require('url');

describe('yakbak', function () {
  var server, tmpdir, yakbak;

  beforeEach(function (done) {
    server = createServer(done);
  });

  afterEach(function (done) {
    server.teardown(done);
  });

  beforeEach(function (done) {
    tmpdir = createTmpdir(done);
  });

  afterEach(function (done) {
    tmpdir.teardown(done);
  });

  describe('record', function () {
    describe('when recording is enabled', function () {
      beforeEach(function () {
        yakbak = subject(server.host, { dirname: tmpdir.dirname });
      });

      it('proxies the request to the server', function (done) {
        request(yakbak)
        .get('/record/1')
        .set('host', 'localhost:3001')
        .set('user-agent', 'node-superagent/0.21.0')
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
        .set('user-agent', 'node-superagent/0.21.0')
        .expect('X-Yakbak-Tape', '3234ee470c8605a1837e08f218494326')
        .expect('Content-Type', 'text/html')
        .expect(201, 'OK')
        .end(function (err) {
          assert.ifError(err);
          assert(fs.existsSync(tmpdir.join('3234ee470c8605a1837e08f218494326.js')));
          done();
        });
      });

      describe('when given a custom hashing function', function () {
        beforeEach(function () {
          yakbak = subject(server.host, { dirname: tmpdir.dirname, hash: customHash });

          // customHash creates a MD5 of the request, ignoring its querystring, headers, etc.
          function customHash(req, body) {
            var hash = crypto.createHash('md5');
            var parts = url.parse(req.url, true);

            hash.update(req.method);
            hash.update(parts.pathname);
            hash.write(body);

            return hash.digest('hex');
          }
        });

        it('uses the custom hash to create the tape name', function (done) {
          request(yakbak)
          .get('/record/1')
          .query({ foo: 'bar' })
          .query({ date: new Date() }) // without the custom hash, this would always cause 404s
          .set('host', 'localhost:3001')
          .set('user-agent', 'node-superagent/0.21.0')
          .expect('X-Yakbak-Tape', '3f142e515cb24d1af9e51e6869bf666f')
          .expect('Content-Type', 'text/html')
          .expect(201, 'OK')
          .end(function (err) {
            assert.ifError(err);
            assert(fs.existsSync(tmpdir.join('3f142e515cb24d1af9e51e6869bf666f.js')));
            done();
          });
        });
      });
    });

    describe("when recording is not enabled", function () {
      beforeEach(function () {
        yakbak = subject(server.host, { dirname: tmpdir.dirname, noRecord: true });
      });

      it('returns a 404 error', function (done) {
        request(yakbak)
        .get('/record/2')
        .set('host', 'localhost:3001')
        .set('user-agent', 'node-superagent/0.21.0')
        .expect(404)
        .end(done);
      });

      it('does not make a request to the server', function (done) {
        request(yakbak)
        .get('/record/2')
        .set('host', 'localhost:3001')
        .set('user-agent', 'node-superagent/0.21.0')
        .end(function (err) {
          assert.ifError(err);
          assert.equal(server.requests.length, 0);
          done();
        });
      });

      it('does not write the tape to disk', function (done) {
        request(yakbak)
        .get('/record/2')
        .set('host', 'localhost:3001')
        .set('user-agent', 'node-superagent/0.21.0')
        .end(function (err) {
          assert.ifError(err);
          assert(!fs.existsSync(tmpdir.join('3234ee470c8605a1837e08f218494326.js')));
          done();
        });
      });
    });
  });

  describe('playback', function () {
    beforeEach(function () {
      yakbak = subject(server.host, { dirname: tmpdir.dirname });
    });

    beforeEach(function (done) {
      var file = '305c77b0a3ad7632e51c717408d8be0f.js';
      var tape = [
        'var path = require("path");',
        'module.exports = function (req, res) {',
        '  res.statusCode = 201;',
        '  res.setHeader("content-type", "text/html")',
        '  res.setHeader("x-yakbak-tape", path.basename(__filename, ".js"));',
        '  res.end("YAY");',
        '}',
        ''
      ].join('\n');

      fs.writeFile(tmpdir.join(file), tape, done);
    });

    it('does not make a request to the server', function (done) {
      request(yakbak)
      .get('/playback/1')
      .set('host', 'localhost:3001')
      .set('user-agent', 'node-superagent/0.21.0')
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
});
