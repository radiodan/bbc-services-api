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

    streamer.addListener("eventStream", writeToResponse);

    res.write(streamer.cache());

    req.on("close", function() {
      // request closed unexpectedly
      server.removeListener("eventStream", writeToResponse);
    });

    req.on("end", function() {
      // request ended normally
      server.removeListener("eventStream", writeToResponse);
    });

    function writeToResponse(msg) {
      res.write(msg);
    }
  }
};
