var services = require("../services.json").services,
    logoPath = "/images/logos/radio";

module.exports = function(datastore) {
  return function(req, res) {
    var uri = req.protocol + "://" + req.headers.host,
        latestInfo = {services: services.map(addDataToService)};

    res.json(latestInfo);
    res.end();

    function addDataToService(service) {
      return {
        id: service.id,
        streams: datastore.store.audioStreams[service.id],
        nowAndNext: datastore.store.nowAndNext[service.id],
        logos: { svg: logoURL(uri, service.logoId, "svg") }
      };
    }
    function logoURL(uri, logoId, type) {
      return uri+logoPath+"/svg/"+logoId+"."+type;
    }
  }
}
