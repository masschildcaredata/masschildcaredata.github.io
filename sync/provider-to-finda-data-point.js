function providerToFindaDataPoint(provider) {
  if (!pathExistsInObject(['geodata', 'latLng', 'lng'], provider) ||
    !pathExistsInObject(['geodata', 'latLng', 'lat'], provider)) {

    return null;
  }

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

function pathExistsInObject(path, object) {
  var current = object;
  return path.every(segmentExists, true);
  
  function segmentExists(segment) {
    current = current[segment];
    return current;
  }
}
      
module.exports = providerToFindaDataPoint;
