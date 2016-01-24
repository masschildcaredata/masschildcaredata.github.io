function summarizeGeocodedProvider(provider) {
  if (!provider.lat || !provider.lng) {
    return null;
  }

  return {
    providerid: provider.providerid,
    lat: provider.lat,
    lng: provider.lng
  };
}
      
module.exports = summarizeGeocodedProvider;
