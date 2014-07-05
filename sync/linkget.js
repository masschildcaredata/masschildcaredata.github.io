var request = require('request');

var rootQueryURL ='http://www.eec.state.ma.us/ChildCareSearch/Handler1.ashx?lat=42.39326095581055%20&long=-71.13453674316406&r=500&programtype=ALL%20CARE';

function getDetailLinksFromBody(body) {
  var r = /providerid=(\d+)/g;
  var match;
  var detailIds = [];
  while ((match = r.exec(body)) != null) {
    detailIds.push(match[1]);
  }
  return detailIds.map(assembleProviderDetailLink);
}

function assembleProviderDetailLink(providerId) {
  return 'http://www.eec.state.ma.us/ChildCareSearch/ProvDetail.aspx?providerid=' + 
  providerId;
}

request(rootQueryURL, function done(error, response, body) {
  if (error) {
    process.stderr.write(error);
  }
  else {
    var links = getDetailLinksFromBody(body);
    process.stdout.write(JSON.stringify(links, null, '  '));
  }
});
