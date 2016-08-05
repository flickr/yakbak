// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var semver = require('semver');
var path = require('path');
var fs = require('fs');

function read(file) {
  return fs.readFileSync(path.join(__dirname, file + '.js'), 'utf8');
}

/**
 * Returns a fixture based on a sufix and node version
 * @type {String} sufix
 * @returns {String}
 */
module.exports = function (sufix) {
  /**
  * node >= 1.5.0 sends the content-length whenever possible
  * @see https://github.com/nodejs/node/pull/1062
  */
  if (semver.gte(process.version, '1.5.0')) {
    return read('v1.5.0-' + sufix);
  } else {
    return read('v0.10.x-' + sufix);
  }
};
