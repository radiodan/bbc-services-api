var services = require("../services.json").services,
    logoPath = "/images/logos/radio";

module.exports = function(datastore) {
  return function(req, res) {
    var uri = req.protocol + "://" + req.headers.host,
        latestInfo = { services: services.map(addDataToService) };

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
          svg: logoURL(uri, service.logoId, "svg"),
          colour: service.colour
        }
      };
    }

    function logoURL(uri, logoId, type) {
      return uri+logoPath+"/svg/"+logoId+"."+type;
    }
  }
}
