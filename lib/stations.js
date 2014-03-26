var services = require("../services.json").services,
    logoURL  = require("./logo-url");

module.exports = function(req, res) {
  res.json({ stations: extractStations(services) });
  res.end();

  function extractStations(services) {
    return services.map(function(service) {
      return {
        id: service.id,
           title: service.title,
           logos: {
             svg: logoURL(req, service.logoId, "svg"),
           colour: service.colour
           }
      };
    });
  }
}
