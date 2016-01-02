var fs = require('fs');
var through = require('through2');
var summarizeGeocodedProvider = require('./summarize-geocoded-provider');
var ldj = require('ldjson-stream');

var providerdatalocation = process.argv[2];

if (!providerdatalocation) {
  process.stderr.write('Usage: node summarize-geocoded-providers.js [line-separated provider data JSON file]\n');
  process.exit();
}

var count = 0;

function convertEntry(provider, encoding, done) {
  var dataPoint = summarizeGeocodedProvider(provider);
  count += 1;
  if (dataPoint) {
    this.push(dataPoint);
  }
  done();
}

function logError(error) {
  console.error(error);
}

function writeHeader() {
  console.log('[\n');
}

function writeFooter() {
  console.log(']\n');
}

function dataPointToLine(dataPoint, encoding, done) {
  this.push(JSON.stringify(dataPoint, null, '  ') + ',\n');
  done();
}

function streamProvidersToSummaries() {
  var streamOpts = {
    objectMode: true
  };

  var providerToSummaryStream = through(streamOpts, convertEntry);
  var summaryToLineStream = through(streamOpts, dataPointToLine);

  var readStream = fs.createReadStream(providerdatalocation);
  readStream.on('end', writeFooter);

  readStream
    .pipe(ldj.parse())
    .pipe(providerToSummaryStream)
    .pipe(summaryToLineStream)
    .pipe(process.stdout);
}

writeHeader();
streamProvidersToSummaries();

