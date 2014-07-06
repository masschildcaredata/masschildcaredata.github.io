var request = require('request');
var queue = require('queue-async');
var fs = require('fs');

var detailsfilelocation = process.argv[2];
if (!detailsfilelocation) {
  process.stderr.write('Usage: node getbodiesfordetails.js [JSON file containing objects containing provider id]\n');
  process.exit();
}

var q = queue();

function getDataFromProviderId(id, done) {
  var url = assembleProviderDetailLink(id);
  request(url, function getBodyFromProviderFetch(error, response, body) {
    process.stderr.write('Fetching from ' + url + '\n');
    if (error) {
      done(error);
    }
    else {
      process.stderr.write('Got body from ' + url + '\n');
      done(error, {
        providerid: id,
        body: body
      });
    }
  });
}

function assembleProviderDetailLink(providerId) {
  return 'http://www.eec.state.ma.us/ChildCareSearch/ProvDetail.aspx?providerid=' + 
  providerId;
}

function queueFetch(providerid) {
  q.defer(getDataFromProviderId, providerid);
}

var providerDictionaryString = fs.readFileSync(detailsfilelocation);
var providersById = JSON.parse(providerDictionaryString);

Object.keys(providersById).forEach(queueFetch);

q.awaitAll(function presentResults(error, results) {
  if (error) {
    process.stderr.write(error);
  }
  else {
    process.stdout.write(JSON.stringify(results, null, '  '));
  }
});
