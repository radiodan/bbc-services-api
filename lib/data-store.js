var deepEqual    = require("deepequal"),
    EventEmitter = require("events").EventEmitter,
    logger       = require("./logger")(__filename),
    LiveData     = require("./live-data"),
    NowAndNext   = require("./now-and-next");

module.exports = { create: create };

function create() {
  var instance = new EventEmitter;

  instance.liveData     = LiveData.create();
  instance.nowAndNext   = NowAndNext.create();
  instance.store        = {
    liveText: {},
    nowPlaying: {},
    nowAndNext: {}
  };

  bindToEvents();

  return instance;

  function bindToEvents() {
    instance.liveData.addListener("liveText", onLiveText);
    instance.liveData.addListener("nowPlaying", onNowPlaying);
    instance.nowAndNext.addListener("message", onNowAndNext);
  }

  function onLiveText(stationId, data) {
    logger.debug("liveText", stationId, data);

    if(!deepEqual(data, instance.store.liveText[stationId])) {
      instance.store.liveText[stationId] = data;
      instance.emit("liveText", stationId, data);
    }
  }

  function onNowPlaying(stationId, data) {
    logger.debug("nowPlaying", stationId, data);

    if(!deepEqual(data, instance.store.nowPlaying[stationId])) {
      instance.store.nowPlaying[stationId] = data;

      data.received = receivedDate();

      instance.emit("nowPlaying", stationId, data);
    }
  }

  function onNowAndNext(stationId, data) {
    logger.debug("nowAndNext", stationId, data);


    if(!deepEqual(data, instance.store.nowAndNext[stationId])) {
      instance.store.nowAndNext[stationId] = data;

      data.received = receivedDate();

      instance.emit("nowAndNext", stationId, data);
    }
  }

  function receivedDate() {
    return (new Date()).toISOString();
  }
}
