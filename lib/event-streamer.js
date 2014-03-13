var EventEmitter = require("events").EventEmitter;

module.exports = { create: create }

function create(dataStore) {
  var messageCount = 0,
      today = new Date(),
      instance = new EventEmitter();

  // listen to new events
  bindEventsToData();

  // emit stored events
  instance.cache = cache;

  return instance;

  function bindEventsToData() {
    dataStore.addListener("liveText", function(stationId, data) {
      instance.emit("eventStream", liveTextEvent(stationId, data));
    });

    dataStore.addListener("nowPlaying", function(stationId, data) {
      instance.emit("eventStream", nowPlayingEvent(stationId, data));
    });

    dataStore.addListener("nowAndNext", function(stationId, data) {
      instance.emit("eventStream", nowAndNextEvent(stationId, data));
    });

    dataStore.addListener("audioStreams", function(stationId, data) {
      instance.emit("eventStream", audioStreamEvent(stationId, data));
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
    var msg = {};
    msg.service = stationId;
    msg.topic   = "nowPlaying";
    msg.data    = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
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
    var date  = refreshDate();
        year  = date.getFullYear(),
        month = date.getMonth()+1,
        day   = date.getDate();

    if(month > 9) {
      month = "0"+month;
    }

    if(day > 9) {
      day = "0"+day;
    }

    return   ""
           + year
           + month
           + day
           + messageCount++;
  }

  function refreshDate() {
    var now     = new Date(),
        current = today;

    if(now.getDate() !== current.getDate()) {
      today        = now;
      messageCount = 0;
      return now;
    }

    return current;
  }
}
