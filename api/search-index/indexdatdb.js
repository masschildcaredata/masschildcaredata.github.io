var dat = require('dat');
var Writable = require('stream').Writable;
// var si = require('search-index');
// TODO: Use NPM version.
var si = require('../../../search-index/lib/search-index.js');

var datlocation = process.argv[2];
var indexlocation = process.argv[3];

if (!datlocation || !indexlocation) {
  process.stderr.write('Usage: node indexdatdb.js [location of dat instance] [location of indexed DB]\n');
  process.exit();
}

var rowCount = 0;
var filters = [
  'key',
  'version',
  'geodata'
];

var indexStream = Writable({objectMode: true});
indexStream._write = function indexRow(row, enc, next) {
  // console.log(row);
  var batch = {};
  batch[row.key] = row.value;

  si.add(batch, 'row' + rowCount, filters, function done(msg) {
    // console.log(msg);
  });
  rowCount += 1;

  next();
};

var datdb = dat(datlocation, function useDat(error) {
  if (error) {
    console.log(error);
  }
  else {
    process.nextTick(addIndexes);
  }
});


function addIndexes() {
  console.log('Adding indexes.');
  datdb.createReadStream({objectMode: true}).pipe(indexStream);
}
