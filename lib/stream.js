var logger = require("./logger")(__filename);

module.exports = function(datastore) {
  var streamer = require("./event-streamer").create(datastore);

  return function handleRequest(req, res) {
    req.socket.setTimeout(Infinity);

    req.on("close", function() {
      logger.info("Request closed unexpectedly");
      closeRequest();
    });

    req.on("end", function() {
      logger.info("Request ended normally");
      closeRequest();
    });

    req.on("error", function(err) {
      logger.info("Request returned an error: "+err);
      closeRequest();
    });

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    res.write("\n");

    logger.info("Request connected");
    streamer.addListener("eventStream", writeToResponse);

    res.write(streamer.cache());

    function writeToResponse(msg) {
      res.write(msg);
    }

    function closeRequest() {
      streamer.removeListener("eventStream", writeToResponse);
      res.end();
      logger.debug("Request closed");
    }
  }
};
