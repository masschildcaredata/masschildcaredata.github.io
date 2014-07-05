var request = require('request');
var queue = require('queue-async');
var fs = require('fs');

var linkfilelocation = process.argv[2];
if (!linkfilelocation) {
  process.stderr.write('Usage: node bodiesfromlinks.js [JSON file containing array of links]\n');
  process.exit();
}

var q = queue();

function getDataFromProviderURL(url, done) {
  request(url, function getBodyFromProviderFetch(error, response, body) {
    process.stderr.write('Fetching from ' + url + '\n');
    if (error) {
      done(error);
    }
    else {
      process.stderr.write('Got body from ' + url + '\n');
      done(error, body);
    }
  });
}


function queueFetch(url) {
  q.defer(getDataFromProviderURL, url);
}

var providerlistString = fs.readFileSync(linkfilelocation);
var providerlist = JSON.parse(providerlistString);

providerlist.forEach(queueFetch);
q.awaitAll(function presentResults(error, results) {
  if (error) {
    process.stderr.write(error);
  }
  else {
    process.stdout.write(JSON.stringify(results, null, '  '));
  }
});
