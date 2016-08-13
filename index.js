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
var curl = require('./lib/curl');
var debug = require('debug')('yakbak:server');
var _ = require('lodash');

/**
 * Returns a new yakbak proxy middleware.
 * @param {String}  host The hostname to proxy to
 * @param {Object}  opts
 * @param {String}  opts.dirname The tapes directory
 * @param {Boolean} opts.ignoreCookies ignore cookie values for tape name hash
 * @param {Array}   opts.recordStatusCodes Array of two integers e.g. [200, 300) indicating the range of acceptable status codes for recording tapes
 * @param {Boolean} opts.noRecord if true, requests will return a 404 error if the tape doesn't exist
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
        if (opts.noRecord) {
          throw new RecordingDisabledError('Recording Disabled');
        } else {
            return proxy(req, body, host).then(function (pres) {
                if (_.inRange(pres.statusCode, opts.recordStatusCodes[0], opts.recordStatusCodes[1]))
                    return record(pres.req, pres, file);
                else {
                    throw new StatusCodeOutOfRangeError('Status code out of range, skipping recording', res);
                }
            });
        }
      })
    }).then(function (file) {
      return require(file);
    }).then(function (tape) {
      return tape(req, res);
    }).catch(RecordingDisabledError, function (err) {
      /* eslint-disable no-console */
      console.log('An HTTP request has been made that yakbak does not know how to handle');
      console.log(curl.request(req));
      /* eslint-enable no-console */
      res.statusCode = err.status;
      res.end(err.message);
    }).catch(StatusCodeOutOfRangeError, function(err) {
        console.log(err.message);
        res.statusCode = err.res.statusCode;
        res.headers = err.res.headers;
        res.end();
    })
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

/**
 * Error class that is thrown when an unmatched request
 * is encountered in noRecord mode
 * @constructor
 */

function RecordingDisabledError(message) {
  this.message = message;
  this.status = 404;
}

RecordingDisabledError.prototype = Object.create(Error.prototype);

/**
 * Error class that is thrown when response code does not
 * fall in the required range in options
 * @constructor
 */
function StatusCodeOutOfRangeError(message, res) {
  this.message = message;
  this.res = res;
}

StatusCodeOutOfRangeError.prototype = Object.create(Error.prototype);
