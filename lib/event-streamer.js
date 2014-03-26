var EventEmitter = require("events").EventEmitter;

module.exports = { create: create }

function create(dataStore) {
  var messageCount = 0,
      today = new Date(),
      instance = new EventEmitter();

  instance.store = {
    liveText: {},
    nowPlaying: {},
    nowAndNext: {},
    audioStreams: {}
  };

  // listen to new events
  bindEventsToData();

  // emit stored events
  instance.cache = cache;

  return instance;

  function bindEventsToData() {
    dataStore.addListener("liveText", function(stationId, data) {
      var eventStream = liveTextEvent(stationId, data);

      instance.store.liveText[stationId] = eventStream;
      instance.emit("eventStream", eventStream);
    });

    dataStore.addListener("nowPlaying", function(stationId, data) {
      var eventStream = nowPlayingEvent(stationId, data);

      instance.store.nowPlaying[stationId] = eventStream;
      instance.emit("eventStream", eventStream);
    });

    dataStore.addListener("nowAndNext", function(stationId, data) {
      var eventStream = nowAndNextEvent(stationId, data);

      instance.store.nowAndNext[stationId] = eventStream;
      instance.emit("eventStream", eventStream);
    });

    dataStore.addListener("audioStreams", function(stationId, data) {
      var eventStream = audioStreamEvent(stationId, data);

      instance.store.audioStreams[stationId] = eventStream;
      instance.emit("eventStream", eventStream);
    });
  }

  function cache() {
    var output = [];

    for(stationId in instance.store.liveText) {
      var data = instance.store.liveText[stationId];

      output.push(data);
    };

    for(stationId in instance.store.nowPlaying) {
      var data = instance.store.nowPlaying[stationId];

      output.push(data);
    };

    for(stationId in instance.store.nowAndNext) {
      var data = instance.store.nowAndNext[stationId];

      output.push(data);
    };

    for(stationId in instance.store.audioStreams) {
      var data = instance.store.audioStreams[stationId];

      output.push(data);
    };

    return output.join("");
  }

  function liveTextEvent(stationId, data) {
    var msg = {};
    msg.received = receivedDate();
    msg.service  = stationId;
    msg.topic    = "liveText";
    msg.data     = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function nowPlayingEvent(stationId, data) {
    var msg = {};
    msg.received = receivedDate();
    msg.service  = stationId;
    msg.topic    = "nowPlaying";
    msg.data     = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function nowAndNextEvent(stationId, data) {
    var msg = {};
    msg.received = receivedDate();
    msg.service  = stationId;
    msg.topic    = "nowAndNext";
    msg.data     = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function audioStreamEvent(stationId, data) {
    var msg = {};
    msg.received = receivedDate();
    msg.service  = stationId;
    msg.topic    = "audioStreams";
    msg.data     = data;

    return "id: "+messageId()+"\ndata: "+JSON.stringify(msg)+"\n\n";
  }

  function receivedDate() {
    return (new Date()).toISOString();
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
