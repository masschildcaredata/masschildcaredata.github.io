var fs = require('fs');
var through = require('through2');
var providerToFindaDataPoint = require('./provider-to-finda-data-point');
var ldj = require('ldjson-stream');

var providerdatalocation = process.argv[2];

if (!providerdatalocation) {
  process.stderr.write('Usage: node get-finda-data.js [line-separated provider data JSON file]\n');
  process.exit();
}

var count = 0;

function convertEntry(provider, encoding, done) {
  var dataPoint = providerToFindaDataPoint(provider);
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
  console.log(
    '{\n' +
    '"type": "FeatureCollection",\n' +
    '"features": [\n'
  );
}

function writeFooter() {
  console.log(']\n}\n');
}

function dataPointToLine(dataPoint, encoding, done) {
  this.push(JSON.stringify(dataPoint, null, '  ') + ',\n');
  done();
}

function streamProvidersToDataPoints() {
  var streamOpts = {
    objectMode: true
  };

  var providerToFindaStream = through(streamOpts, convertEntry);
  var dataPointToLineStream = through(streamOpts, dataPointToLine);

  var readStream = fs.createReadStream(providerdatalocation);
  readStream.on('end', writeFooter);

  readStream
    .pipe(ldj.parse())
    .pipe(providerToFindaStream)
    .pipe(dataPointToLineStream)
    .pipe(process.stdout);
}

writeHeader();
streamProvidersToDataPoints();
