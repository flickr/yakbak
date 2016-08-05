var path = require("path");

/**
 * GET /
 *
 * host: {addr}:{port}
 * user-agent: My User Agent/1.0
 * connection: close
 */

module.exports = function (req, res) {
  res.statusCode = 201;

  res.setHeader("content-type", "image/gif");
  res.setHeader("date", "Sat, 26 Oct 1985 08:20:00 GMT");
  res.setHeader("connection", "close");
  res.setHeader("transfer-encoding", "chunked");

  res.setHeader("x-yakbak-tape", path.basename(__filename, ".js"));

  res.write(new Buffer("R0lG", 'base64'));
  res.end();

  return __filename;
};
