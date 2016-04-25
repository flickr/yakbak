// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var path = require('path');
var fs = require('fs');

function read(file) {
  return fs.readFileSync(path.join(__dirname, file + '.js'), 'utf8');
}

module.exports = read('v0.10.x');
