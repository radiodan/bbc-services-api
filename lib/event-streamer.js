var EventEmitter = require('events').EventEmitter;

module.exports = { create: create }

function create(dataStore) {
  var messageCount = 0,
      instance = new EventEmitter();

  // listen to new events
  bindEventsToData();

  // emit stored events
  instance.cache = cache;

  return instance;

  function bindEventsToData() {
    dataStore.liveData.addListener('liveText', function(stationId, data) {
      instance.emit('eventStream', liveTextEvent(stationId, data));
    });

    dataStore.liveData.addListener('nowPlaying', function(stationId, data) {
      instance.emit('eventStream', nowPlayingEvent(stationId, data));
    });

    dataStore.nowAndNext.addListener('message', function(stationId, data) {
      instance.emit('eventStream', nowAndNextEvent(stationId, data));
    });

    dataStore.audioStreams.addListener('message', function(stationId, data) {
      instance.emit('eventStream', audioStreamEvent(stationId, data));
    });
  }

  function cache() {
    var output = [];

    for(stationId in dataStore.store.liveText) {
      var data = dataStore.store.liveText[stationId];

      output.push(liveTextEvent(stationId, data));
    };

    for(stationId in dataStore.store.nowPlaying) {
      var data = dataStore.store.nowPlaying[stationId];

      output.push(nowPlayingEvent(stationId, data));
    };

    for(stationId in dataStore.store.nowAndNext) {
      var data = dataStore.store.nowAndNext[stationId];

      output.push(nowAndNextEvent(stationId, data));
    };

    for(stationId in dataStore.store.audioStreams) {
      var data = dataStore.store.audioStreams[stationId];

      output.push(audioStreamEvent(stationId, data));
    };

    return output.join("");
  }

  function liveTextEvent(stationId, data) {
    var msg = {};
    msg.service = stationId;
    msg.topic   = "liveText";
    msg.data    = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function nowPlayingEvent(stationId, data) {
    data.service = stationId;
    data.topic   = "nowPlaying";

    return "id: "+messageId()+"\ndata: "+JSON.stringify(data)+"\n\n";
  }

  function nowAndNextEvent(stationId, data) {
    var msg = {};
    msg.service = stationId;
    msg.topic   = "nowAndNext";
    msg.data    = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function audioStreamEvent(stationId, data) {
    var msg = {};
    msg.service = stationId;
    msg.topic   = "audioStream";
    msg.data    = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function messageId() {
    var today = new Date();

    return "" +
           today.getFullYear() +
           today.getMonth() +
           today.getDate() +
           messageCount++;
  }
}
