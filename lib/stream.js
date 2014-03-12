var logger = require('./logger')(__filename);

module.exports = function(datastore) {
  var streamer = require('./event-streamer').create(datastore);

  return function handleRequest(req, res) {
    req.socket.setTimeout(Infinity);

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });

    res.write("\n");

    logger.info("Request connected");
    streamer.addListener("eventStream", writeToResponse);

    res.write(streamer.cache());

    req.on("close", function() {
      logger.info("Request closed unexpectedly");
      server.removeListener("eventStream", writeToResponse);
      res.end();
    });

    req.on("end", function() {
      logger.info("Request ended normally");
      server.removeListener("eventStream", writeToResponse);
      res.end();
    });

    function writeToResponse(msg) {
      res.write(msg);
    }
  }
};
