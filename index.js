// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var hash = require('incoming-message-hash');
var assert = require('assert');
var mkdirp = require('mkdirp');
var path = require('path');
var buffer = require('./lib/buffer');
var proxy = require('./lib/proxy');
var record = require('./lib/record');
var debug = require('debug')('yakbak:server');

/**
 * Returns a new yakbak proxy middleware.
 * @param {String} host The hostname to proxy to
 * @param {Object} opts
 * @param {String} opts.dirname The tapes directory
 * @returns {Function}
 */

module.exports = function (host, opts) {
  assert(opts.dirname, 'You must provide opts.dirname');

  return function (req, res) {
    mkdirp.sync(opts.dirname);

    debug('req', req.url);

    buffer(req).then(function (body) {
      req.body = body;
      req.hash = hash.sync(req, Buffer.concat(req.body));
      req.path = path.join(opts.dirname, req.hash + '.js');

      return require.resolve(req.path);
    }).catch(function (err) {
      return err.code === 'MODULE_NOT_FOUND';
    }, function (err) {
      return proxy(req, req.body, host).then(function (res) {
        return record(res.req, res, req.path);
      });
    }).then(function (file) {
      return require(file);
    }).then(function (tape) {
      return tape(req, res);
    });

  };
};
