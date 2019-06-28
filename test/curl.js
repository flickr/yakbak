// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

/* eslint-env mocha */

var subject = require('../lib/curl');
var assert = require('assert');

describe('curl', function () {

  it('formats an http.IncomingRequest', function () {
    var req = {
      httpVersion: '1.1',
      method: 'GET',
      url: 'https://www.flickr.com',
      headers: {
        host: 'www.flickr.com'
      }
    };

    assert.deepEqual(subject.request(req),
      '< GET https://www.flickr.com HTTP/1.1\n' +
      '< host: www.flickr.com\n' +
      '<'
    );
  });

  it('formats an http.ServerResponse', function () {
    var req = {
      httpVersion: '1.1'
    };

    var res = {
      statusCode: '200',
      _headers: {
        date: 'Wed, 22 Jun 2016 22:02:31 GMT'
      }
    };

    assert.deepEqual(subject.response(req, res),
      '> HTTP/1.1 200 OK\n' +
      '> date: Wed, 22 Jun 2016 22:02:31 GMT\n' +
      '>'
    );
  });

});
