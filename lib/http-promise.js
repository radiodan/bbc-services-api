var Q = require('q'),
    http = require('q-io/http');

module.exports = { get: get };

function get(uri) {
  return http.request(uri)
    .then(returnBody, console.warn);
}

function returnBody(resp) {
  return resp.body.read().then(function(body) {
    return Q.resolve(body.toString('utf8'));
  });
}
