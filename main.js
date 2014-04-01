var express          = require("express"),
    connect          = require("connect"),
    http             = require("http"),
    logger           = require("./lib/logger")(__filename),
    allowCrossDomain = require("./lib/allow-cross-domain"),
    dataStore        = require("./lib/data-store").create(),
    services         = require("./lib/services")(dataStore),
    stations         = require("./lib/stations"),
    logos            = require("./lib/logos"),
    stream           = require("./lib/stream")(dataStore),
    authName         = process.env.BASIC_AUTH,
    port             = (process.env.PORT || 5000),
    server           = module.exports = express();

server.configure(function() {
  server.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  server.use(connect.methodOverride());
  server.use(connect.urlencoded());
  server.use(connect.json());
  server.use(allowCrossDomain);
  server.use(server.router);
  server.use(connect.static("public"));

  if(authName) {
    server.use(connect.basicAuth(authName, authName));
  }
});

server.get("/", function(req, res) {
  res.send("<h1>BBC Radio Services API</h1>");
  res.end();
});

server.get("/services.json", services);
server.get("/stations.json", stations);
server.get("/logos.json", logos);
server.get("/stream", stream);

http.createServer(server).listen(port);
logger.info("Started server on port", port);
