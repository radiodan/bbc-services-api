var logger = require("./logger")(__filename);

module.exports = function(datastore) {
  var streamer = require("./event-streamer").create(datastore);

  return function handleRequest(req, res) {
    req.socket.setTimeout(Infinity);

    req.on("close", function() {
      logger.info("Request closed unexpectedly");
      streamer.removeListener("eventStream", writeToResponse);
      res.end();
    });

    req.on("end", function() {
      logger.info("Request ended normally");
      streamer.removeListener("eventStream", writeToResponse);
      res.end();
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
  }
};
