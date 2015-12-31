var test = require('tape');
var providerToFindaDataPoint = require('../sync/provider-to-finda-data-point');

var testProvider = {
  "providerid": "2666",
  "Program Name": "Wilson, Terryl A.",
  "Accepts EEC Vouchers": "Yes",
  "Capacity": "8",
  "First Licensed On": "12/14/2007",
  "Most Recently Renewed": "12/14/2013",
  "EEC Regional Licensing Office": "1441 Main Street, Suite 230  Springfield 01103413-788-8401",
  "EEC Licensor": "Sandra Moultrie",
  "Type of care": "Family Child Care",
  "First Name": "TERRYL A.",
  "Last Name": "WILSON",
  "Telephone": "4137398670",
  "Address": "408 ORANGE ST",
  "City": "SPRINGFIELD",
  "State": "MA",
  "ZipCode": "01108-1908",
  "Child Care Resource Referral Agency (CCR&R)": "New England Farm Workers Council",
  "CCR&R Phone": "413-272-2207",
  "CC&RR Website": "www.partnersforcommunity.org",
  "geodata": {
    "street": "408 Orange Street",
    "adminArea6": "",
    "adminArea6Type": "Neighborhood",
    "adminArea5": "Richmond",
    "adminArea5Type": "City",
    "adminArea4": "Madison",
    "adminArea4Type": "County",
    "adminArea3": "KY",
    "adminArea3Type": "State",
    "adminArea1": "US",
    "adminArea1Type": "Country",
    "postalCode": "40475",
    "geocodeQualityCode": "L1AAA",
    "geocodeQuality": "ADDRESS",
    "dragPoint": false,
    "sideOfStreet": "N",
    "linkId": "0",
    "unknownInput": "",
    "type": "s",
    "latLng": {
      "lat": 37.747064,
      "lng": -84.288582
    },
    "displayLatLng": {
      "lat": 37.747064,
      "lng": -84.288582
    },
    "mapUrl": "http://www.mapquestapi.com/staticmap/v4/getmap?key=Fmjtd|luur206tl1,8x=o5-9ay2l4&type=map&size=225,160&pois=purple-1,37.7470643141232,-84.2885822656753,0,0,|&center=37.7470643141232,-84.2885822656753&zoom=15&rand=1964128825"
  }
};

var expectedDataPoint = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [-84.288582, 37.747064]
  },
  "properties": {
    "providerid": "2666",
    "Program Name": "Wilson, Terryl A.",
    "Accepts EEC Vouchers": "Yes",
    "Capacity": "8",
    "First Licensed On": "12/14/2007",
    "Most Recently Renewed": "12/14/2013",
    "EEC Regional Licensing Office": "1441 Main Street, Suite 230  Springfield 01103413-788-8401",
    "EEC Licensor": "Sandra Moultrie",
    "Type of care": "Family Child Care",
    "First Name": "TERRYL A.",
    "Last Name": "WILSON",
    "Telephone": "4137398670",
    "Address": "408 ORANGE ST",
    "City": "SPRINGFIELD",
    "State": "MA",
    "ZipCode": "01108-1908",
    "Child Care Resource Referral Agency (CCR&R)": "New England Farm Workers Council",
    "CCR&R Phone": "413-272-2207",
    "CC&RR Website": "www.partnersforcommunity.org",
    "geodata": {
      "street": "408 Orange Street",
      "adminArea6": "",
      "adminArea6Type": "Neighborhood",
      "adminArea5": "Richmond",
      "adminArea5Type": "City",
      "adminArea4": "Madison",
      "adminArea4Type": "County",
      "adminArea3": "KY",
      "adminArea3Type": "State",
      "adminArea1": "US",
      "adminArea1Type": "Country",
      "postalCode": "40475",
      "geocodeQualityCode": "L1AAA",
      "geocodeQuality": "ADDRESS",
      "dragPoint": false,
      "sideOfStreet": "N",
      "linkId": "0",
      "unknownInput": "",
      "type": "s",
      "latLng": {
        "lat": 37.747064,
        "lng": -84.288582
      },
      "displayLatLng": {
        "lat": 37.747064,
        "lng": -84.288582
      },
      "mapUrl": "http://www.mapquestapi.com/staticmap/v4/getmap?key=Fmjtd|luur206tl1,8x=o5-9ay2l4&type=map&size=225,160&pois=purple-1,37.7470643141232,-84.2885822656753,0,0,|&center=37.7470643141232,-84.2885822656753&zoom=15&rand=1964128825"
    }
  }
};

test('Basic test', function basicTest(t) {
  var dataPoint = providerToFindaDataPoint(testProvider);
  t.deepEqual(dataPoint, expectedDataPoint, 'Data point is correct.');
  // console.log(JSON.stringify(dataPoint, null, '  '));
  t.end();
});
