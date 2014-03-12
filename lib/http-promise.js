var Q              = require("q"),
    http           = require("http"),
    logger         = require("./logger")(__filename);

module.exports = { get: get };

function get(uri) {
  var requested = Q.defer(),
      dataFound = Q.defer();

  http.get(uri, requested.resolve);

  requested.promise.then(function(res) {
    var body = "";

    res.setEncoding("utf8");

    res.on("data", function(chunk) {
      body += chunk;
    });

    res.on("end", function() {
      dataFound.resolve(body);
    });

    req.on("error", function(error) {
      logger.warn(error);
      dataFound.reject(error);
    });
  });

  return dataFound.promise;
}
