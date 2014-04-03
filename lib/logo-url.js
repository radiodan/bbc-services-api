module.exports = function (req, logoId, type) {
  var uri = req.protocol + "://" + req.headers.host,
      logoPath = "/images/logos/radio";

  return uri+logoPath+"/"+type+"/"+logoId+".svg";
}
