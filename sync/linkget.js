var fs = require('fs');

var detailsfilelocation = process.argv[2];

function assembleProviderDetailLink(providerId) {
  return 'http://www.eec.state.ma.us/ChildCareSearch/ProvDetail.aspx?providerid=' + 
  providerId;
}


var detailsString = fs.readFileSync(detailsfilelocation);
var detailsForIds = JSON.parse(detailsString);
var providerids = Object.keys(detailsForIds);

process.stdout.write(
  JSON.stringify(providerids.map(assembleProviderDetailLink), null, '  ')
);
