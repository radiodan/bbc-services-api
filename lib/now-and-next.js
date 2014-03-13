var Q              = require("q"),
    EventEmitter   = require("events").EventEmitter,
    services       = require("../services.json").services,
    http           = require("./http-promise"),
    logger         = require("./logger")(__filename),
    nitroAPIKey    = process.env.NITRO_API_KEY;

if(typeof nitroAPIKey === "undefined") {
  logger.error("NITRO_API_KEY not found in ENV");
  process.exit();
}

module.exports = { create: create };

function create() {
  var instance    = new EventEmitter,
      httpPromise = Q.nbind(http.get);

  services.forEach(fetchNowNext);

  return instance;

  function fetchNowNext(service) {
    var url = nitroURL(service.nitroId);

    return fetchNitro(url)
           .then(parseNowNext, parseError)
           .then(function(nowNext) {
             setNowNextInterval(service, nowNext[0]);
             logger.debug(service.id, nowNext);
             instance.emit("message", service.id, nowNext);
            });

    function parseError(err) {
      logger.error(service.id, service.nitroId, err);
    }
  }

  function nitroURL(stationId) {
    var timeNow = (new Date()).toISOString(),
        host   = "d.bbc.co.uk",
        prefix = "/nitro/api/broadcasts?page_size=2&mixin=titles",
        path   =  prefix
                 +"&end_from="+timeNow
                 +"&sid="+stationId
                 +"&api_key="+nitroAPIKey;

    return {host: host, path: path};
  }

  function fetchNitro(uri) {
    var request = {
          hostname: uri.host,
          path: uri.path,
          headers: {
            "Accept": "application/json"
          }
        };

    return http.get(request);
  }

  function parseNowNext(json) {
    var nowNext, data;

    try {
      data = JSON.parse(json).nitro;
    } catch(err) {
      logger.warn(err.toString());
      return Q.reject(err);
    }

    nowNext = data.results.items.map(parseProgramme);

    return nowNext;
  }

  function parseProgramme(prog) {
    var parents = prog.ancestors_titles,
        brand   = parents.brand || parents.series,
        episode = parents.episode,
        res     = {};

    res.episode   = episode.title || episode.containers_title;
    res.brand     = brand.title;
    res.pid       = episode.pid;
    res.start     = prog.published_time.start;
    res.end       = prog.published_time.end;
    res.duration  = prog.published_time.duration;

    if(res.episode === res.brand) {
      res.episode = episode.presentation_title;
    }

    return res;
  }

  function setNowNextInterval(service, programme) {
    var nowTime = new Date(),
        endTime = new Date(programme.end),
        remaining = endTime - nowTime;

    logger.debug("interval", service.id, remaining);
    setTimeout(fetchNowNext, remaining, service);
  }
}
