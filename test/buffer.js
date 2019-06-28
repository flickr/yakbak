// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint-env mocha */

var subject = require('../lib/buffer');
var stream = require('stream');
var assert = require('assert');

describe('buffer', function () {

  it('yields the stream contents', function (done) {
    var str = new stream.PassThrough;

    subject(str).then(function (body) {
      assert.deepEqual(body, [
        new Buffer('a'),
        new Buffer('b'),
        new Buffer('c')
      ]);
      done();
    }).catch(function (err) {
      done(err);
    });

    str.write('a');
    str.write('b');
    str.write('c');
    str.end();
  });

  it('yields an error', function (done) {
    var str = new stream.PassThrough;

    subject(str).then(function () {
      done(new Error('should have yielded an error'));
    }).catch(function (err) {
      assert.equal(err.message, 'boom');
      done();
    });

    str.emit('error', new Error('boom'));
  });

});
