var dat = require('dat');
var Writable = require('stream').Writable;

var datlocation = process.argv[2];
var indexlocation = process.argv[3];

if (!datlocation || !indexlocation) {
  process.stderr.write('Usage: node indexdatdb.js [location of dat instance] [location of indexed DB]\n');
  process.exit();
}

var indexStream = Writable({objectMode: true});
indexStream._write = function indexRow(row, enc, next) {
  console.log(row);
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
