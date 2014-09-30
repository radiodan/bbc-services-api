var winston = require("winston"),
    path    = require("path");

var logLevel = process.env.LOG_LEVEL || "info",
    isolateLog = process.env.ISOLATE_LOG || false;

var sharedLogger = function(filename) {
  var label = path.basename(filename, ".js"),
      thisLogLevel = determineLogLevel(label);

  return new winston.Logger({
    level: thisLogLevel,
    transports: [
      new winston.transports.Console({
        prettyPrint: true,
        timestamp: true,
        level: thisLogLevel,
        label: label
      })
    ]
  });
};

sharedLogger.setLevel = function (val) {
  logLevel = val;
}

function determineLogLevel(label) {
  if(isolateLog && label != isolateLog) {
    return "off";
  } else {
    return logLevel;
  }
}

module.exports = sharedLogger;
