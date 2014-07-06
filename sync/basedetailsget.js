var request = require('request');

var rootQueryURL ='http://www.eec.state.ma.us/ChildCareSearch/Handler1.ashx?lat=42.39326095581055%20&long=-71.13453674316406&r=500&programtype=ALL%20CARE';
var locationRegexp = /VELatLong\(([\d\.-]+),([\d\.-]+)/;
var idRegexp = /providerid=(\d+)/;

function getDetailsFromBody(body) {
  var documentHalfWithLocations = body.split('var providerlist')[0];
  var providerChunks = documentHalfWithLocations.split('</a>');
  var details = [];
  
  providerChunks.forEach(function addDetail(chunk) {
    var detail = extractDataFromChunk(chunk);
    if (detail) {
      details.push(detail);
    }
  });

  return details;
  //.map(assembleProviderDetailLink);
}

function extractDataFromChunk(chunk) {
  var data = null;
  var idMatch = chunk.match(idRegexp);
  if (idMatch) {
    data = {
      providerid: idMatch[1]
    };

    var locationMatch = chunk.match(locationRegexp);
    if (locationMatch) {
      data.lat = locationMatch[1];
      data.long = locationMatch[2];
    }
  }
  return data;
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
    var links = getDetailsFromBody(body);
    process.stdout.write(JSON.stringify(links, null, '  '));
  }
});
