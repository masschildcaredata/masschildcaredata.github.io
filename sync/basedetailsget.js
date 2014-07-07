var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var listingsfilelocation = process.argv[2];

if (!listingsfilelocation) {
  process.stderr.write('Usage: node basedetailsget.js [file containing aggregated listings web pages for childcare providers]\n');
  process.exit();
}

var rootQueryURL ='http://www.eec.state.ma.us/ChildCareSearch/Handler1.ashx?lat=42.39326095581055%20&long=-71.13453674316406&r=500&programtype=ALL%20CARE';
// var locationRegexp = /VELatLong\(([\d\.-]+),([\d\.-]+)/;
var idRegexp = /providerid=(\d+)/;

function getDetailsFromHTML(htmlString) {
  debugger;
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

var htmlString = fs.readFileSync(listingsfilelocation);
var details = getDetailsFromHTML(htmlString);
process.stdout.write(JSON.stringify(details, null, '  '));

