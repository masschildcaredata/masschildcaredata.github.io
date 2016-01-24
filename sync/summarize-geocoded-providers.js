var fs = require('fs');
var through = require('through2');
var summarizeGeocodedProvider = require('./summarize-geocoded-provider');

var providerdatalocation = process.argv[2];

if (!providerdatalocation) {
  process.stderr.write('Usage: node summarize-geocoded-providers.js ' + 
    '<line-separated provider data JSON file> [--ldjson]\n');
  process.exit();
}

var ldjsonMode = false;

if (process.argv.length > 3 && process.argv[3] === '--ldjson') {
  ldjsonMode = true;
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
  var serialized;
  if (ldjsonMode) {
    serialized = JSON.stringify(dataPoint);
  }
  else {
    serialized = JSON.stringify(dataPoint, null, '  ');
    serialized += ',';
  }
  serialized += '\n';
  this.push(serialized);
  done();
}

function streamProvidersToSummaries() {
  var streamOpts = {
    objectMode: true
  };

  var providerToSummaryStream = through(streamOpts, convertEntry);
  var summaryToLineStream = through(streamOpts, dataPointToLine);

  var readStream = fs.createReadStream(providerdatalocation);
  if (!ldjsonMode) {
    readStream.on('end', writeFooter);
  }

  readStream
    .pipe(ldj.parse())
    .pipe(providerToSummaryStream)
    .pipe(summaryToLineStream)
    .pipe(process.stdout);
}

if (!ldjsonMode) {
  writeHeader();
}

streamProvidersToSummaries();
