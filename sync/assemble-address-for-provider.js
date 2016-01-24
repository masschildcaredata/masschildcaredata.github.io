var intraBuildingUnitNames = [
  'fl',
  '#',
  'apt',
  'ste'
];

function assembleAddressForProvider(p) {
  if (p && typeof p.Address === 'string') {
    // MapQuest seems to think Mass. addresses are in Kansas if you use the zip
    // sometimes. Best to leave it off.
    var streetAddress = cleanStreetAddress(removeRepeat(p.Address));

    return streetAddress + ', ' + p.City + ', ' + p.State;
  }
}

function removeRepeat(a) {
  var cleaned = a;
  var parts = a.split(' ');
  if (parts.length > 5 && parts.length % 2 === 0) {
    var midIndex = parts.length/2;
    if (parts[0].toLowerCase() === parts[midIndex].toLowerCase() &&
      parts[1].toLowerCase() === parts[midIndex + 1].toLowerCase()) {

      cleaned = parts.slice(0, midIndex).join(' ');
    }
  }
  return cleaned;
}

function cleanStreetAddress(a) {
  var cleaned = a;
  var parts = a.split(' ');
  if (parts.length > 3) {
    var nextToLast = parts.length - 2;
    if (isIntraBuildingUnit(parts[nextToLast])) {
      cleaned = parts.slice(0, nextToLast).join(' ');
    }
  }
  return cleaned;
}

function isIntraBuildingUnit(word) {
  return intraBuildingUnitNames.indexOf(word.toLowerCase()) !== -1;
}

module.exports = assembleAddressForProvider;
