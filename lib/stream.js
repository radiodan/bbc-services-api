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

    streamer.addListener("eventStream", function(msg) {
      res.write(msg);
    });

    res.write(streamer.cache());
  }
};
