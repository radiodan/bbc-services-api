var Q              = require("q"),
    EventEmitter   = require("events").EventEmitter,
    services       = require("../services.json").services,
    logger         = require("./logger")(__filename),
    http           = require("./http-promise"),
    endPoint       = "http://polling.bbc.co.uk/radio/nowandnextservice/",
    retryOnSuccess = 3000,
    retryOnFail    = 1000;

module.exports = { create: create };

function create() {
  var instance = new EventEmitter;

  services.forEach(function(service) {
    pollForLiveData(service);
  });

  return instance;

  function pollForLiveData(service) {
    var pollId    = service.nitroId,
        stationId = service.id;

    return makeRequest();

    function makeRequest() {
      return http.get(endPoint+pollId)
        .then(handleData, retryRequest)
        .then(null, function(e) { logger.warn(e.stack); });
    }

    function retryRequest(err, waitTime) {
      var sleepPromise = Q.defer();

      waitTime = waitTime || retryOnFail;

      if(err) {
        logger.error(err.stack);
      }

      setTimeout(function(){
        sleepPromise.resolve();
      }, waitTime);

      return sleepPromise.promise.then(makeRequest);
    }

    function handleData(data) {
      var json, liveText, nowPlaying;

      try {
        json = JSON.parse(data);
      } catch(err) {
        json = {};
      }

      if(json.hasOwnProperty("message")) {
        try {
          liveText   = json.message.programme.shortSynopsis;
          nowPlaying = json.message.trackExtended;
        } catch(err) {
          logger.error(err.stack);
        }

        emitLiveText(stationId, liveText);
        emitNowPlaying(stationId, nowPlaying);
      }

      return retryRequest(false, retryOnSuccess);
    }

    function emitLiveText(stationId, message) {
      logger.debug("liveText", stationId, message);

      instance.emit("liveText", stationId, message);
    }

    function emitNowPlaying(stationId, message) {
      logger.debug("nowPlaying", stationId, message);

      instance.emit("nowPlaying", stationId, message);
    }
  }
}
