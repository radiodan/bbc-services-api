var express          = require("express"),
    connect          = require("connect"),
    http             = require("http"),
    logger           = require("./lib/logger")(__filename),
    allowCrossDomain = require("./lib/allow-cross-domain"),
    services         = require("./lib/services"),
    stream           = require("./lib/stream"),
    basicAuth        = express.basicAuth(process.env.BASIC_AUTH, process.env.BASIC_AUTH),
    port             = (process.env.PORT || 5000),
    server           = module.exports = express();

server.configure(function() {
  server.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  server.use(connect.urlencoded());
  server.use(connect.json());
  server.use(allowCrossDomain);
  server.use(basicAuth);
  server.use(server.router);
  server.use(express["static"]("public"));
});

server.get("/services.json", services);
server.get("/stream", stream);

http.createServer(server).listen(port);
logger.info("Started server on port", port);
