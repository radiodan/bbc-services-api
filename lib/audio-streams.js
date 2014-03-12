var Q              = require('q'),
    http           = require('http'),
    EventEmitter   = require('events').EventEmitter,
    services       = require("../services.json").services,
    logger         = require("./logger")(__filename),
    rescanInterval = (2 * 60 * 60 * 1000),
    streamCountRegex = /NumberOfEntries=(\d+)$/mi;

module.exports = { create: create };

function create() {
  var instance    = new EventEmitter,
      httpPromise = Q.nbind(http.get);

  services.forEach(fetchStream);

  return instance;

  function fetchStream(service) {
    parseStreams(service);
    setInterval(parseStreams, rescanInterval, service);
  }

  function parseStreams(service) {
    var playlistURL = fetchPlaylistURL(service.streamId);

    return fetchPlaylist(playlistURL)
           .then(parsePlaylist)
           .then(function(streams) {
             logger.debug(service.id, streams);
             instance.emit(service.id, streams);
            });
  }

  function fetchPlaylistURL(stationId) {
    if(stationId === false) {
      return "http://www.bbc.co.uk/worldservice/meta/live/mp3/eneuk.pls";
    }

    return "http://www.bbc.co.uk/radio/listen/live/"
          + stationId
          + "_aaclca.pls";
  }

  function fetchPlaylist(url) {
    var fetchURL = Q.defer();
    http.get(url, fetchURL.resolve);

    return fetchURL.promise.then(function(res) {
      var dataFound = Q.defer();
      res.on("data", function(chunk) {
        dataFound.resolve(chunk.toString());
      });
      return dataFound.promise;
    });
  }

  function parsePlaylist(playlist) {
    var def     = Q.defer,
        expires = new Date(new Date().getTime()+rescanInterval+(60*1000)),
        streams = [],
        streamCount;

    try {
      streamCount = streamCountRegex.exec(playlist)[1];
    } catch(err) {
      streamCount = 0;
    }

    for (var i = 0; i < parseInt(streamCount); i++) {
      var fileNumber  = i+1,
          streamRegex = new RegExp("File"+fileNumber+"=(.*)$", 'im'),
          result      = streamRegex.exec(playlist);

      if(typeof result !== 'null') {
        streams.push({url: result[1], expires: expires});
      }
    }

    return streams;
  }
}
