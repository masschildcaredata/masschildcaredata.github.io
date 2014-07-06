var http = require('http');
var request = require('request');
var cheerio = require('cheerio');

var rootQueryURL ='http://www.eec.state.ma.us/ChildCareSearch/morethan300.aspx?lat=42.156028747558594+&long=-71.56590270996094&r=500&programtype=ALL+CARE&zip=&city=';

var headers = {
  'Origin': 'http://www.eec.state.ma.us',
  'Accept-Encoding': 'gzip,deflate,sdch',
  'Accept-Language': 'en-US,en;q=0.8,de;q=0.6',
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.153 Safari/537.36',
  'Content-Type': 'application/x-www-form-urlencoded',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Cache-Control': 'max-age=0',
  'Referer': rootQueryURL,
  'Connection': 'keep-alive',
  'DNT': '1'
};

// var locationRegexp = /VELatLong\(([\d\.-]+),([\d\.-]+)/;
// var idRegexp = /providerid=(\d+)/;

function createFormDataForPageNumber(pageNumber) {
  return '__EVENTTARGET=GridView1' + '&' +
    '__EVENTARGUMENT=Page%24' + pageNumber + '&' +
    '__VIEWSTATE=%2FwEPDwULLTEwOTA5NjQyMTgPZBYCAgUPZBYCAgEPPCsADQEADxYEHgtfIURhdGFCb3VuZGceC18hSXRlbUNvdW50ApJAZBYCZg9kFiICAQ9kFgZmDw8WAh4EVGV4dAUiQSBQbGFjZSB0byBHcm93IGF0IFN0cmF3YmVycnkgSGlsbGRkAgEPDxYCHwIFPDQwIFNUUkFXQkVSUlkgSElMTCBSRCAsQ09OQ09SRCxNQSwwMTc0Mi01NTAyPGJyIC8%2BOTc4MzY5MjY5OWRkAgIPZBYCZg8PFgIeC05hdmlnYXRlVXJsBSJ%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTUyMjQ1ZGQCAg9kFgZmDw8WAh8CBSZBIFBsYWNlIHRvIEdyb3cgYXQgdGhlIFN0cmF0dG9uIFNjaG9vbGRkAgEPDxYCHwIFOTE4MCBNT1VOVEFJTiBBVkUgLEFSTElOR1RPTixNQSwwMjQ3NC0yMDIzPGJyIC8%2BNzgxNjQ2NjAyMWRkAgIPZBYCZg8PFgIfAwUhflxQcm92RGV0YWlsLmFzcHg%2FcHJvdmlkZXJpZD04MDY5ZGQCAw9kFgZmDw8WAh8CBSRBIFN0ZXAgSW4gVGltZSBEYXljYXJlIGFuZCBQcmVzY2hvb2xkZAIBDw8WAh8CBTkxOTQgV0VTVCBTVCBTVEUgMTYgLE1JTEZPUkQsTUEsMDE3NTctMjI3NDxiciAvPjUwODQyMjk4NjFkZAICD2QWAmYPDxYCHwMFIn5cUHJvdkRldGFpbC5hc3B4P3Byb3ZpZGVyaWQ9NDA5MDVkZAIED2QWBmYPDxYCHwIFIEEgdG8gWiAgQ2hpbGQgQ2FyZSBhbmQgUHJlc2Nob29sZGQCAQ8PFgIfAgUzMTI2IEdPVUxEIFNUICxORUVESEFNLE1BLDAyNDk0LTIzMDQ8YnIgLz43ODE0NDQ2NTQxZGQCAg9kFgJmDw8WAh8DBSF%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTYwMTJkZAIFD2QWBmYPDxYCHwIFNkEgVG91Y2ggb2YgSG9uZXkgRWFybHkgQ2hpbGRob29kIExlYXJuaW5nIENlbnRlciwgSW5jLmRkAgEPDxYCHwIFSDQyIENvbW1vbndlYWx0aCBBdmVudWUvU3VpdGUgMSAsTm9ydGggQXR0bGVib3JvLE1BLDAyNzYzPGJyIC8%2BNTA4MzE2MTcxNmRkAgIPZBYCZg8PFgIfAwUiflxQcm92RGV0YWlsLmFzcHg%2FcHJvdmlkZXJpZD00MjQ3M2RkAgYPZBYGZg8PFgIfAgUPQWFsdG8sIE1hbm9uIE0uZGQCAQ8PFgIfAgUzMzgyIE5BU0hVQSBSRCAsRFJBQ1VULE1BLDAxODI2LTI5MjY8YnIgLz45Nzg0NTQwNzc5ZGQCAg9kFgJmDw8WAh8DBSJ%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTQ5MzM0ZGQCBw9kFgZmDw8WAh8CBQ9BYmFkZWV2YSwgRWxlbmFkZAIBDw8WAh8CBTM2MyBEUlVNTElOIFJEICxORVdUT04sTUEsMDI0NTktMjgwNjxiciAvPjYxNzMzMjY2ODFkZAICD2QWAmYPDxYCHwMFIn5cUHJvdkRldGFpbC5hc3B4P3Byb3ZpZGVyaWQ9NTQ2NzZkZAIID2QWBmYPDxYCHwIFHVRoZSBBYmFudHdhbmEgTGVhcm5pbmcgQ2VudGVyZGQCAQ8PFgIfAgUzMzAgRElNT0NLIFNUICxST1hCVVJZLE1BLDAyMTE5LTEyMTA8YnIgLz42MTc0NDI4ODAwZGQCAg9kFgJmDw8WAh8DBSF%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTcyMjZkZAIJD2QWBmYPDxYCHwIFDEFCQkFTLCBGQUlaQWRkAgEPDxYCHwIFNDIxIEhBTkNPQ0sgU1QgLE1FTFJPU0UsTUEsMDIxNzYtNjMyNzxiciAvPjc4MTY2MjE3MDdkZAICD2QWAmYPDxYCHwMFIn5cUHJvdkRldGFpbC5hc3B4P3Byb3ZpZGVyaWQ9MzAxNjlkZAIKD2QWBmYPDxYCHwIFDUFCQkFTLCBGQVRJSEFkZAIBDw8WAh8CBTE0NCBPVElTIFNUICxNRUxST1NFLE1BLDAyMTc2LTI2MzA8YnIgLz43ODE2NjIyOTI3ZGQCAg9kFgJmDw8WAh8DBSJ%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTM1NTMxZGQCCw9kFgZmDw8WAh8CBThBYmJvdHQgV2VsbGVzbGV5IEhpbGxzIENoaWxkcmVuXCdzIExlYXJuaW5nIENlbnRlciwgSW5jLmRkAgEPDxYCHwIFOTI4IEFCQk9UVCBSRCAsV0VMTEVTTEVZIEhMUyxNQSwwMjQ4MS03NTE5PGJyIC8%2BNzgxMjM1MjQxOGRkAgIPZBYCZg8PFgIfAwUiflxQcm92RGV0YWlsLmFzcHg%2FcHJvdmlkZXJpZD00NTUxMmRkAgwPZBYGZg8PFgIfAgUTQWJib3R0LCBLaW1iZXJseSBBLmRkAgEPDxYCHwIFNDI4IFNVTlNFVCBEUiAsQlJPQ0tUT04sTUEsMDIzMDEtMjgzMzxiciAvPjUwODU4NzgyNzhkZAICD2QWAmYPDxYCHwMFIn5cUHJvdkRldGFpbC5hc3B4P3Byb3ZpZGVyaWQ9MTc4NjBkZAIND2QWBmYPDxYCHwIFEkFCQyBFYXJseSBMZWFybmluZ2RkAgEPDxYCHwIFNTIxIFNhbmR3aWNoIFJkICxXYXJlaGFtLE1BLDAyNTcxLTE2MjY8YnIgLz41MDgyOTUxNzM0ZGQCAg9kFgJmDw8WAh8DBSJ%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTQ4OTgzZGQCDg9kFgZmDw8WAh8CBRFBQkMgRnVuIFByZXNjaG9vbGRkAgEPDxYCHwIFNjM3MiBHUk9WRSBTVCAsRkFMTCBSSVZFUixNQSwwMjcyMC01MjQ5PGJyIC8%2BNTA4Njc1MDk4OGRkAgIPZBYCZg8PFgIfAwUiflxQcm92RGV0YWlsLmFzcHg%2FcHJvdmlkZXJpZD01MjYxNmRkAg8PZBYGZg8PFgIfAgUeQUJDIE51cnNlcnkgYW5kIERheWNhcmUgQ2VudGVyZGQCAQ8PFgIfAgUyODUyIFNBTEVNIFNUICxNQUxERU4sTUEsMDIxNDgtNDQzNjxiciAvPjc4MTMyNDM0NDVkZAICD2QWAmYPDxYCHwMFIX5cUHJvdkRldGFpbC5hc3B4P3Byb3ZpZGVyaWQ9NzE4OWRkAhAPZBYGZg8PFgIfAgUSQUJDIE51cnNlcnkgU2Nob29sZGQCAQ8PFgIfAgU2OSBBQ0FERU1ZIFNUICxDSEVMTVNGT1JELE1BLDAxODI0LTI2MTM8YnIgLz45NzgyNTY1ODA1ZGQCAg9kFgJmDw8WAh8DBSF%2BXFByb3ZEZXRhaWwuYXNweD9wcm92aWRlcmlkPTUwNDRkZAIRDw8WAh4HVmlzaWJsZWhkZBgBBQlHcmlkVmlldzEPPCsACgICAgEIAoIEZJRaTZ7wvDMQlSfvM12PXn0gyB4T&__EVENTVALIDATION=%2FwEWDAKY7r%2BfCgKtsuq4BAKtsuK4BAKtsva4BAKtsvq4BAKtsu64BAKtsvK4BAKtssa4BAKtssq4BALDuK6IBQKokYx1ArGr%2B%2F0C87WlYUGywOmV4CXm%2B7IWgmr067s%3D';
}


// function getDetailsFromBody(body) {
//   var documentHalfWithLocations = body.split('var providerlist')[0];
//   var providerChunks = documentHalfWithLocations.split('</a>');
//   var detailsForIds = {};
  
//   providerChunks.forEach(function addDetail(chunk) {
//     var detail = extractDataFromChunk(chunk);
//     if (detail) {
//       detailsForIds[detail.providerid] = detail;
//     }
//   });

//   return detailsForIds;
// }

// function extractDataFromChunk(chunk) {
//   var data = null;
//   var idMatch = chunk.match(idRegexp);
//   if (idMatch) {
//     data = {
//       providerid: idMatch[1]
//     };

//     var locationMatch = chunk.match(locationRegexp);
//     if (locationMatch) {
//       data.lat = locationMatch[1];
//       data.long = locationMatch[2];
//     }
//   }
//   return data;
// }

function findNumberOfPages(done) {
  debugger;
  var httpOpts = {
    hostname: 'www.eec.state.ma.us',
    port: 80,
    path: '/ChildCareSearch/morethan300.aspx?lat=42.156028747558594+&long=-71.56590270996094&r=500&programtype=ALL+CARE&zip=&city=',
    method: 'POST',
    headers: headers,

  };

  var req = http.request(httpOpts, function requestCallback(res) {
    var results = {
      body: ''
    };
    results.statusCode = res.statusCode;
    results.headers = res.headers;

    res.setEncoding('utf8');
    res.on('data', function receiveChunk(chunk) {
      results.body += chunk;
    });
    res.on('end', function endData() {
      // outputStream.write(JSON.stringify(results, null, '  '));
      process.stderr.write('Received page listing number of pages: ' + 
        JSON.stringify(results, null, '  ')
      );
      extractNumberOfPagesFromLastPage(results.body, done);
    });
  });

  req.on('error', function respondToError(e) {
    process.stderr.write('Error making request: ' + e);
    done(e);
  });

  var formData = createFormDataForPageNumber('Last');
  req.write(formData);
  req.end();
}

function extractNumberOfPagesFromLastPage(body, done) {
  $ = cheerio.load(body);
  // Select the last cell in the table at the bottom of the page that lists 
  // the available pages in the search result.
  var lastPageCell = $('td[colspan="3"] > table tr td:last-child');
  if (!lastPageCell) {
    done('Could not find number of pages in search.');
  }
  else {
    debugger;
    var numberOfPages = +(lastPageCell.text());
    process.stderr.write('Found number of pages: ' + numberOfPages + '\n');
    done(null, numberOfPages);
  }
}

function getPages(numberOfPages) {
  console.log(numberOfPages);
}

findNumberOfPages(function done(error, numberOfPages) {
  if (error) {
    process.stderr.write('Could not get number of pages: ' + error + '\n');
  }
  else {
    getPages(numberOfPages);
  }
});
