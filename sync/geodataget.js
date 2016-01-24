var fs = require('fs');
var mapquest = require('mapquest');
var ldj = require('ldjson-stream');
var through = require('through2');
var assembleAddressForProvider = require('./assemble-address-for-provider');

var providerdatalocation = process.argv[2];

if (!providerdatalocation) {
  process.stderr.write('Usage: node geodataget.js [line-separated provider data JSON file]\n');
  process.exit();
}

if (!process.env.MAPQUEST_API_KEY) {
  process.stderr.write(
    'MAPQUEST_API_KEY environment variable must be set.\n' +
    'e.g. MAPQUEST_API_KEY=<your key> node geodataget.js  [line-separated provider data JSON file]\n'
  );
  process.exit();
}

var geocodeStreamOpts = {
  objectMode: true
};

var geocodeStream = through(geocodeStreamOpts, addGeocode);
// geocodeStream.on('error', logError);

fs.createReadStream(providerdatalocation)
  .pipe(ldj.parse())
  .pipe(geocodeStream)
  .pipe(ldj.serialize())
  .pipe(process.stdout);

function addGeocode(p, enc, done) {
  var address = assembleAddressForProvider(p);
  if (address) {
    mapquest.geocode(
      {
        address: address
      },
      addResults
    );
  }
  else {
      logError(new Error('No address for providerid: ' + p.providerid));
    done();
  }

  function addResults(error, location) {
    if (error) {
      // Log the error, but don't stop the stream.
      logError(error);
      done();
    }
    else {
      var lat = location.latLng.lat;
      var lng = location.latLng.lng;
      if (latLngIsOutsideOfMass(lat, lng)) {
        // Log the error, but don't stop the stream.
        logError(new Error('Got geocode ' + lat + ', ' + lng +
          ' outside of Mass for address: ' + address +
          ', providerid: ' + p.providerid
        ));
        done();
      }
      else {
        p.lat = location.latLng.lat;
        p.lng = location.latLng.lng;
        done(null, p);
      }
    }
  }
}

function logError(error) {
  console.error(error);  
}

function latLngIsOutsideOfMass(lat, lng) {
  return lng < -74 || lng > -70 || lat < 41 || lat > 43;
}
