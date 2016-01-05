function summarizeGeocodedProvider(provider) {
  if (!pathExistsInObject(['geodata', 'latLng'], provider)) {
    return null;
  }

  return {
    providerid: provider.providerid,
    lat: provider.geodata.latLng.lat,
    lng: provider.geodata.latLng.lng
  };
}

function pathExistsInObject(path, object) {
  var current = object;
  return path.every(segmentExists, true);
  
  function segmentExists(segment) {
    current = current[segment];
    return current;
  }
}
      
module.exports = summarizeGeocodedProvider;
