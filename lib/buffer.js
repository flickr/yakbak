// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var Promise = require('bluebird');

/**
 * Collect `stream`'s data in to an array of Buffers.
 * @param {stream.Readable} stream
 * @returns {Promise.<Array>}
 */

module.exports = function buffer(stream) {
  return new Promise(function (resolve, reject) {
    var data = [];

    stream.on('data', function (buf) {
      data.push(buf);
    });

    stream.on('error', function (err) {
      reject(err);
    });

    stream.on('end', function () {
      resolve(data);
    });
  });
};
