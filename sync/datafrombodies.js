var queue = require('queue-async');
var fs = require('fs');
var cheerio = require('cheerio');

var bodiesfilelocation = process.argv[2];
var detailsfilelocation = process.argv[3];
var JSONArrayMode = (process.argv[4] === '--JSON-array');

if (!bodiesfilelocation) {
  process.stderr.write('Usage: node datafrombodies.js [JSON file containing array of objects containing ids and web page bodies] [JSON file mapping lat/long details to provider ids]\n');
  process.exit();
}

var q = queue();

function getDataFromBody(providerid, body, done) {
  $ = cheerio.load(body);
  var rows = $('tr');
  var data = {
    providerid: providerid
  };

  var details = detailsDict[providerid];
  if ('lat' in details) {
    data.lat = details.lat;
  }
  if ('long' in details) {
    data.long = details.long;
  }

  rows.each(function saveKeyAndValue(i, row) {
    var cols = $('td', row);
    if (cols.length === 2) {
      data[$(cols[0]).text().trim()] = $(cols[1]).text().trim();
    }
  });
  done(null, data);
}

function queueDataExtraction(bodyContainer) {
  q.defer(getDataFromBody, bodyContainer.providerid, bodyContainer.body);
}

var bodiesString = fs.readFileSync(bodiesfilelocation);
var bodylist = JSON.parse(bodiesString);
var detailsString = fs.readFileSync(detailsfilelocation);
var detailsDict = JSON.parse(detailsString);

debugger;
bodylist.forEach(queueDataExtraction);

q.awaitAll(function presentResults(error, results) {
  debugger;
  if (error) {
    process.stderr.write(error);
  }
  else {
    if (JSONArrayMode) {
      process.stdout.write(JSON.stringify(results, null, '  '));
    }
    else {
      // Write as line-separated JSON.
      results.forEach(function writeLine(result) {
        process.stdout.write(JSON.stringify(result) + '\n');
      });
    }
  }
});
