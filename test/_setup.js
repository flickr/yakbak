// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var tmpdir = require('os-tmpdir');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var path = require('path');

beforeEach(function () {
  this.tmpdir = path.join(tmpdir(), String(Date.now()));
});

beforeEach(function (done) {
  mkdirp(this.tmpdir, done);
});

afterEach(function (done) {
  rimraf(this.tmpdir, done);
});
