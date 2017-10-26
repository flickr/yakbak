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
 * @returns {Promise.<String>}
 */

function writeStreamToFile(file_name, body){
  debug('write to json', file_name);
  return new Promise((resolve, reject) => {
    let file = fs.createWriteStream(file_name);
    body.forEach((data) => {file.write(data, 'utf8')})
    file.end();
    resolve(body);
  })
}

//TODO buffer(req).then(-> this might give us the whole request object)
module.exports = function (req, res, filename) {
  return buffer(res).then(function (body) {
    let data_file = filename.replace(/\.js$/, '.json');
    return writeStreamToFile(data_file, body);
  }).then((body) => {
    let data_file = filename.replace(/\.js$/, '.json');
    return render({fs: fs, data_file: data_file, json_data: body.toString(), req: req, res: res, params: req.body});
  })
  .then(function (data) {
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
    fs.writeFile(filename, data, 'utf8', done);
  });
}
