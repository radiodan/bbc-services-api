var Q = require('q');

var services = require("../services.json").services,
    logoURL  = require("./logo-url"),
    logoBase64 = require("./logo-base64");

module.exports = function(req, res) {
  var promises = services.map(function (service) {
    return logoBase64(service.logoId, "svg")
            .then(function (base64) {
              return {
                id: service.id,
                svg: {
                  url: logoURL(req, service.logoId, "svg"),
                  base64: base64
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
