// Copyright 2019 SmugMug, Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var tmpdir = require('os-tmpdir');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');

/**
 * Creates a temporary directory for use in tests.
 * @param {Function} done
 * @returns {Object}
 */

module.exports = function createTmpdir(done) {
  return new Dir().setup(done);
};

function Dir() {
  this.dirname = path.join(tmpdir(), String(Date.now()));
}

Dir.prototype = Object.create(null);

Dir.prototype.join = function (val) {
  return path.join(this.dirname, val);
};

Dir.prototype.setup = function (done) {
  mkdirp(this.dirname, done);
  return this;
};

Dir.prototype.teardown = function (done) {
  rimraf(this.dirname, done);
  return this;
};
