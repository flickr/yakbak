// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var semver = require('semver');
var path = require('path');
var fs = require('fs');

function read(file) {
  return fs.readFileSync(path.join(__dirname, file + '.js'), 'utf8');
}

/**
 * node >= 1.5.0 sends the content-length whenever possible
 * @see https://github.com/nodejs/node/pull/1062
 */

if (semver.gte(process.version, '1.5.0')) {
  module.exports = read('v1.5.0');
} else {
  module.exports = read('v0.10.x');
}
