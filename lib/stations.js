var services = require("../services.json").services,
    stations = { stations: extractStations(services) };

module.exports = function(req, res) {
  res.json(stations);
  res.end();
}

function extractStations(services) {
  return services.map(function(service) {
    return {
      id: service.id,
      title: service.title,
    };
  });
}
