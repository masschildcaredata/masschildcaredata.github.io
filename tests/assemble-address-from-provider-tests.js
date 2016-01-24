var test = require('tape');
var assembleAddressForProvider = require('../sync/assemble-address-for-provider');

var testCases = [
  {
    name: 'No fixes needed',
    provider: {
      "Address":"71 Chestnut St","City":"ANDOVER","State":"MA"
    },
    expected: '71 Chestnut St, ANDOVER, MA'
  },
  {
    name: 'Floor number in address',
    provider: {
      "providerid":"3198",
      "Address":"179 BAILEY ST FL 2",
      "City":"LAWRENCE",
      "State":"MA"
    },
    expected: '179 BAILEY ST, LAWRENCE, MA'
  },
  {
    name: 'Apt. number in address via #',
    provider: {
      "providerid":"3278",
      "Address":"235 W SELDEN ST # 1",
      "City":"MATTAPAN",
      "State":"MA"
    },
    expected: '235 W SELDEN ST, MATTAPAN, MA'
  },
  {
    name: 'Apt. number in address via `APT`',
    provider: {
      "Address":"24 TAFT ST APT 2","City":"REVERE","State":"MA"
    },
    expected: '24 TAFT ST, REVERE, MA'
  },
  {
    name: 'Suite',
    provider: {
      "Address":"5 Wally Krueger Way Ste 5","City":"Bridgewater","State":"MA"
    },
    expected: '5 Wally Krueger Way, Bridgewater, MA'
  },
  {
    name: 'Repeated address',
    provider: {
      "Address":"62 WOLF SWAMP RD 62 WOLF SWAMP RD","City":"LONGMEADOW","State":"MA"
    },
    expected: '62 WOLF SWAMP RD, LONGMEADOW, MA'
  },
  {
    name: 'Repeated address with abbreviation',
    provider: {
      "Address": "285 Apremont Highway 285 APREMONT HWY","City":"HOLYOKE","State":"MA"
    },
    expected: '285 Apremont Highway, HOLYOKE, MA'
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test(testCase.name, function basicTest(t) {
    t.equal(assembleAddressForProvider(testCase.provider), testCase.expected);
    t.end();
  });
}

