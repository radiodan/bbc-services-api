var Q = require('q');

var services = require("../services.json").services,
    logoURL  = require("./logo-url"),
    logoContents = require("./logo-contents");

module.exports = function(req, res) {
  var promises = services.map(function (service) {
    return logoContents(service.logoId, "svg")
            .then(function (contents) {
              return {
                id: service.id,
                svg: {
                  url: logoURL(req, service.logoId, "svg"),
                  base64: contents.base64,
                  raw: JSON.stringify(contents.raw)
                },
                colour: service.colour
              };
            });
  });

  Q.spread(promises, collectDataAndSendResponse);

  function collectDataAndSendResponse(/* resolved promises */) {
    var data = Array.prototype.slice.call(arguments);
    res.json({ logos: data });
    res.end();
  }

}
