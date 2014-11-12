module.exports = function (req, logoId, type) {
  var uri = req.protocol + "://" + (req.get('X-Forwarded-Host') || req.get('Host')),
      logoPath = "/images/logos/radio";

  return uri+logoPath+"/"+type+"/"+logoId+".svg";
}
