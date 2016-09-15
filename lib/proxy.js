// Copyright 2016 Yahoo Inc.
// Licensed under the terms of the MIT license. Please see LICENSE file in the project root for terms.

var Promise = require('bluebird');
var https = require('https');
var http = require('http');
var url = require('url');
var debug = require('debug')('yakbak:proxy');

/**
 * Protocol to module map, natch.
 * @private
 */

var mods = { 'http:': http, 'https:': https };

/**
 * Proxy `req` to `host` and yield the response.
 * @param {http.IncomingMessage} req
 * @param {Array.<Buffer>} body
 * @param {String} host
 * @returns {Promise.<http.IncomingMessage>}
 */

module.exports = function proxy(req, body, host) {
  return new Promise(function (resolve /* , reject */) {
    var uri = url.parse(host);
    var mod = mods[uri.protocol] || http;
    
    var h = req.headers;
    h['host'] = uri.host;

    var r = {
      hostname: uri.hostname,
      port: uri.port,
      method: req.method,
      path: req.url,
      headers: req.headers,

      servername: uri.hostname,
      rejectUnauthorized: false
    };

    debug('r', r);

    var preq = mod.request(r, function (pres) {
      resolve(pres);
    });
    
    // preq.setHeader('Host', uri.host);

    debug('req', req.url, 'host', uri.host);

    body.forEach(function (buf) {
      preq.write(buf);
    });

    preq.end();
  });
};
