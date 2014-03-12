var logger       = require("./logger")(__filename),
    LiveData     = require("./live-data"),
    NowAndNext   = require("./now-and-next"),
    AudioStreams = require("./audio-streams");

module.exports = { create: create };

function create() {
  var instance = {};

  instance.liveData     = LiveData.create();
  instance.nowAndNext   = NowAndNext.create();
  instance.audioStreams = AudioStreams.create();
  instance.store        = {
    liveText: {},
    nowPlaying: {},
    nowAndNext: {},
    audioStreams: {}
  };

  bindToEvents();

  return instance;

  function bindToEvents() {
    instance.liveData.addListener('liveText', onLiveText);
    instance.liveData.addListener('nowPlaying', onNowPlaying);
    instance.nowAndNext.addListener('message', onNowAndNext);
    instance.audioStreams.addListener('message', onAudioStream);
  }

  function onLiveText(stationId, data) {
    logger.debug('live', stationId, data);
    instance.store.liveText[stationId] = data;
  }

  function onNowPlaying(stationId, data) {
    logger.debug('nowPlaying', stationId, data);
    instance.store.nowPlaying[stationId] = data;
  }

  function onNowAndNext(stationId, nowAndNext) {
    logger.info('nowAndNext', stationId, nowAndNext);
    instance.store.nowAndNext[stationId] = nowAndNext;
  }

  function onAudioStream(stationId, streams) {
    logger.info('audioStreams', stationId, streams);
    instance.store.audioStreams[stationId] = streams;
  }
}
