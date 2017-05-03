// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var Promise = require('bluebird');
var buffer = require('./buffer');
var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var debug = require('debug')('yakbak:record');

/**
 * Read and pre-compile the tape template.
 * @type {Function}
 * @private
 */

var render = ejs.compile(fs.readFileSync(path.resolve(__dirname, '../src/tape.ejs'), 'utf8'));

/**
 * Record the http interaction between `req` and `res` to disk.
 * The format is a vanilla node module that can be used as
 * an http.Server handler.
 * @param {http.ClientRequest} req
 * @param {http.IncomingMessage} res
 * @param {String} filename
 * @param {Function} parse
 * @returns {Promise.<String>}
 */

module.exports = function (req, res, filename, parse) {
  return buffer(res).then(function (body) {
    var data;

    if (parse) {
      data = parse(req, res, body);
    } else {
      data = { req: req, res: res, body: body };
    }
    return render(data);
  }).then(function (data) {
    return write(filename, data);
  }).then(function () {
    return filename;
  });
};

/**
 * Write `data` to `filename`. Seems overkill to "promisify" this.
 * @param {String} filename
 * @param {String} data
 * @returns {Promise}
 */

function write(filename, data) {
  return Promise.fromCallback(function (done) {
    debug('write', filename);
    fs.writeFile(filename, data, done);
  });
}
