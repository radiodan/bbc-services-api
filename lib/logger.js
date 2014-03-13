var winston = require("winston"),
    path    = require("path");

var logLevel = process.env.LOG_LEVEL || "info";

var sharedLogger = function(filename) {
  return new winston.Logger({
    level: logLevel,
    transports: [
      new winston.transports.Console({
        prettyPrint: true,
        timestamp: true,
        level: logLevel,
        label: path.basename(filename, ".js")
      })
    ]
  });
};

sharedLogger.setLevel = function (val) {
  logLevel = val;
}

module.exports = sharedLogger;
