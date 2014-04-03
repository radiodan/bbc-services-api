var services = require("../services.json").services,
    logoURL  = require("./logo-url");

module.exports = function(datastore) {
  return function(req, res) {
    var latestInfo = { services: services.map(addDataToService) };

    res.json(latestInfo);
    res.end();

    function addDataToService(service) {
      return {
        id: service.id,
        title: service.title,
        audioStreams: datastore.store.audioStreams[service.id] || [],
        nowAndNext: datastore.store.nowAndNext[service.id]     || [],
        liveText: datastore.store.liveText[service.id]         || "",
        nowPlaying: datastore.store.nowPlaying[service.id]     || null,
        logos: {
          active: logoURL(req, service.logoId, "active"),
          inactive: logoURL(req, service.logoId, "inactive"),
          colour: service.colour
        }
      };
    }
  }
}
