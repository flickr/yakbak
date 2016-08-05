var contentTypeParser = require('content-type');
var humanReadableContentTypes = [
  'application/javascript',
  'application/json',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain'
];

/**
 * Returns whether a request's body is human readable
 * @param {http.IncomingMessage} req
 * @returns {Boolean}
*/

module.exports = function (res) {
  var contentEncoding = res.headers['content-encoding'];
  var contentType = res.headers['content-type'];
  var identityEncoding = !contentEncoding || contentEncoding === 'identity';

  if (!contentType) {
    return false;
  }
  contentType = contentTypeParser.parse(contentType);

  return identityEncoding && isContentTypeHumanReadable(contentType);
};

/**
 * Returns whether a content-type is human readable based on a whitelist
 * @param {content-type} contentType
 * @returns {Boolean}
*/

function isContentTypeHumanReadable(contentType) {
  return humanReadableContentTypes.indexOf(contentType.type) >= 0;
}
