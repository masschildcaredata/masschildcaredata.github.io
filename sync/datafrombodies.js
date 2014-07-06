var queue = require('queue-async');
var fs = require('fs');
var cheerio = require('cheerio');

var bodiesfilelocation = process.argv[2];
var JSONArrayMode = (process.argv[3] === '--JSON-array');

if (!bodiesfilelocation) {
  process.stderr.write('Usage: node datafrombodies.js [JSON file containing array of web page bodies]\n');
  process.exit();
}

var q = queue();

function getDataFromBody(body, done) {
  $ = cheerio.load(body);
  var rows = $('tr');
  var data = {};
  rows.each(function saveKeyAndValue(i, row) {
    var cols = $('td', row);
    if (cols.length === 2) {
      data[$(cols[0]).text().trim()] = $(cols[1]).text().trim();
    }
  });
  done(null, data);
}

function queueDataExtraction(body) {
  q.defer(getDataFromBody, body);
}

var bodiesString = fs.readFileSync(bodiesfilelocation);
var bodylist = JSON.parse(bodiesString);

bodylist.forEach(queueDataExtraction);

q.awaitAll(function presentResults(error, results) {
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
