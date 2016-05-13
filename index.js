// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var Promise = require('bluebird');
var hash = require('incoming-message-hash');
var assert = require('assert');
var mkdirp = require('mkdirp');
var path = require('path');
var buffer = require('./lib/buffer');
var proxy = require('./lib/proxy');
var record = require('./lib/record');
var debug = require('debug')('yakbak:server');
var _ = require('lodash');

/**
 * Returns a new yakbak proxy middleware.
 * @param {String} host The hostname to proxy to
 * @param {Object} opts
 * @param {String} opts.dirname The tapes directory
 * @param {Boolean} opts.ignoreCookies ignore cookie values for tape name hash
 * @param {Array} opts.recordStatusCodes Array of two integers e.g. [200, 300) indicating the range of acceptable status codes for recording tapes
 * @returns {Function}
 */

module.exports = function (host, opts) {
  assert(opts.dirname, 'You must provide opts.dirname');

  return function (req, res) {
    mkdirp.sync(opts.dirname);

    debug('req', req.url);

    delete req.rawHeaders;
    opts.recordStatusCodes = opts.recordStatusCodes || [0,999];

    return buffer(req).then(function (body) {
      var file = path.join(opts.dirname, tapename(req, body, opts));

      return Promise.try(function () {
        return require.resolve(file);
      }).catch(ModuleNotFoundError, function (/* err */) {
        return proxy(req, body, host).then(function (res) {
          if (_.inRange(res.statusCode, opts.recordStatusCodes[0], opts.recordStatusCodes[1]))
            return record(res.req, res, file);
          else {
            var err = new Error('Status code not in acceptable range, skipping recording');
            err.res = res;
            throw err;
          }
        });
      });

    }).then(function (file) {
      return require(file);
    }).then(function (tape) {
      return tape(req, res);
    }).catch(function(err) {
       if (err.res) {
         res.statusCode = err.res.statusCode;
         res.headers = err.res.headers;
         res.end();
         return null;
       }
    });
  };
};

/**
 * Returns the tape name for `req`.
 * @param {http.IncomingMessage} req
 * @param {Array.<Buffer>} body
 * @param {Object} opts
 * @returns {String}
 */

function tapename(req, body, opts) {
  var tempReq = _.cloneDeep(req);
  if (opts.ignoreCookies) {
    delete tempReq.headers.cookie;
  }
  return hash.sync(tempReq, Buffer.concat(body)) + '.js';
}

/**
 * Bluebird error predicate for matching module not found errors.
 * @param {Error} err
 * @returns {Boolean}
 */

function ModuleNotFoundError(err) {
  return err.code === 'MODULE_NOT_FOUND';
}
