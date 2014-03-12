var mqtt         = require("mqtt"),
    EventEmitter = require('events').EventEmitter,
    services     = require("../services.json").services,
    logger       = require("./logger")(__filename),
    endPoint     = { port: 1883, host: "test.mosquitto.org" },
    topics       = ['bbc/nowplaying/#', 'bbc/livetext/#'],
    topicRegex   = /^bbc\/(livetext|nowplaying)\/(.*)$/;

module.exports = { create: create };

function create() {
  var instance = new EventEmitter,
      client   = mqtt.createClient(endPoint.port, endPoint.host);

  client.subscribe(topics);
  client.on('message', handleMessage);

  return instance;

  function handleMessage(topic, message) {
    var result = topicRegex.exec(topic),
        eventType = result[1],
        stationId = result[2],
        serviceId = serviceIdFor(stationId);

    if(!serviceId) {
      logger.debug("Unknown station", stationId);
      return false;
    }

    switch(eventType) {
      case 'livetext':
        emitLiveText(stationId, message);
        break;
      case 'nowplaying':
        emitNowPlaying(stationId, message);
        break;
      default:
        logger.warn("Unknown eventType", eventType);
    }
  }

  function serviceIdFor(stationId) {
    var match = false;

    services.forEach(function(service) {
      if(service.id === stationId) {
        match = service.id;
      }
    });

    if(match) {
      return match;
    } else {
      return false;
    }
  }

  function emitLiveText(stationId, message) {
    logger.debug('liveText', stationId, message);

    instance.emit('liveText', stationId, message);
  }

  function emitNowPlaying(stationId, message) {
    var msg = JSON.parse(message);

    logger.debug('nowPlaying', stationId, msg);

    instance.emit('nowPlaying', stationId, msg);
  }
}
