function providerToFindaDataPoint(provider) {
  var dataPoint = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
    }
  };

  dataPoint.geometry.coordinates = [
    provider.geodata.latLng.lng, provider.geodata.latLng.lat
  ];

  // Not copying or cloning here. Should not be necessary since this is going
  // straight to JSON after this.
  dataPoint.properties = provider;

  return dataPoint;
}

module.exports = providerToFindaDataPoint;
