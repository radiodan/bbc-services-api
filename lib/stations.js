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
           dabId: service.dabId,
           logos: {
             active: logoURL(req, service.logoId, "active"),
             inactive: logoURL(req, service.logoId, "inactive"),
             colour: service.colour
           }
      };
    });
  }
}
