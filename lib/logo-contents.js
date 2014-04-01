var fs = require('fs'),
    Q  = require('q');

module.exports = function (logoId, type) {
  var logoPath = __dirname + "/../public/images/logos/radio/"+type+'/'+logoId+'.'+type,
      dfd = Q.defer();

  fs.readFile(logoPath, function (err, data) {
    var base64data;

    if (err) { dfd.reject(err); }

    base64data = new Buffer(data).toString('base64');
    dfd.resolve({ base64: base64data, raw: data.toString() });
  });

  return dfd.promise;
}
