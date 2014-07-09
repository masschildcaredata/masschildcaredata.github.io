var request = require('request');
var fs = require('fs');
var split = require('split');
var config = require('../config');
var _ = require('lodash');
var queue = require('queue-async');

var providerdatalocation = process.argv[2];

if (!providerdatalocation) {
  process.stderr.write('Usage: node geodataget.js [line-separated provider data JSON file]\n');
  process.exit();
}


var rootQueryURL = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + 
  config.mapquestAppKey;

function createGeocodeQueryURL(address) {
  return rootQueryURL + 
    '&maxResults=1' + 
    '&location=' + encodeURIComponent(address);
}

// var locationRegexp = /VELatLong\(([\d\.-]+),([\d\.-]+)/;

function logToStderr(message) {
  process.stderr.write(message + '\n');
}

function getDetailsFromHTML(htmlString) {
  $ = cheerio.load(htmlString);
  var links = $('a[href^="ProvDetail.aspx"]');

  var detailsForIds = {};
  
  function addDetail(link) {
    var href = $(link).attr('href');
    var id = extractIdFromChunk(href);
    if (id) {      
      detailsForIds[id] = {
        providerid: id
      };
      // TODO: Add geocodes.
    }
  }

  for (var i = 0; i < links.length; ++i) {
    addDetail(links[i]);
  }

  return detailsForIds;
}

function extractIdFromChunk(chunk) {
  var id = null;
  var idMatch = chunk.match(idRegexp);
  if (idMatch) {
    id = idMatch[1];
  }
  return id;
}

function addGeoDataToProviderEntry(entry) {
  if (typeof entry.Address !== 'string') {
    logToStderr('No address found for provider ' + entry.providerid);
  }
  else {
    var url = createGeocodeQueryURL(entry.Address);
    request(url, {json: 'json'}, 
      _.curry(recordGeocodeResponse)(entry)
    );
  }
}

function recordGeocodeResponse(entry, error, response, body) {
  var problem = checkForProblemInResponse(entry, error, response, body);
  if (!problem) {
    entry.geodata = body.results[0].locations[0];
  }
  process.stdout.write(JSON.stringify(entry) + '\n');
}

function checkForProblemInResponse(entry, error, response, body) {
  var problem;
  if (error) {
    problem = error;
  }
  else if (response.statusCode !== 200) {
    problem = 'Status code: ' + response.statusCode;
  }
  else if (!Array.isArray(body.results)) {
    problem = 'Response does not have an array of results.';
  }
  else if (body.results.length < 1) {
    problem = 'Response has an empty results array.';
  }
  else if (!Array.isArray(body.results[0].locations)) {
    problem = 'Response does not have an array of locations.';
  }
  else if (body.results[0].locations.length < 1) {
    problem = 'Response has an empty locations array.';
  }

  if (problem) {
    var problemMessage = 'Problem while getting geocode for provider ' + 
      entry.providerid + ': ' + problem;
    entry.geodata = {
      problem: problemMessage
    };
    logToStderr(problemMessage);
  }
  return problem;
}

function start() {
  // var q = queue(8);
  // q.awaitAll(function done(error) {
  //   if (error) {
  //     logToStderr('Error: ' + error);
  //   }
  //   else {
  //     logToStderr('Completed!');
  //   }
  // });      

  fs.createReadStream(providerdatalocation)
    .pipe(split())
    .on('data', function processLine(line) {
      if (line.length > 0) {
        addGeoDataToProviderEntry(JSON.parse(line));
        // console.log(line);
      }
    })
}

// var details = getDetailsFromHTML(htmlString);
// process.stdout.write(JSON.stringify(details, null, '  '));
start();

