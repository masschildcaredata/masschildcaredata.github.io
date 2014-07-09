masschildcaredata
=================

This project syncs to the data in the Massachusetts EEC [childcare search site](http://www.eec.state.ma.us/ChildCareSearch/searchEarlyEdu.aspx) and provides all of it as JSON.

Installation
------------

    git clone git@github.com:masschildcaredata/masschildcaredata.github.io.git
    cd masschildcaredata.github.io
    npm install

Then, create a config.js file in the project root containing your [MapQuest API key](http://developer.mapquest.com/) like so:

    module.exports = {
      mapquestAppKey: 'numberslettersandsymbols'
    };

Usage
-----

If you just want the data, [here's the JSON file](http://masschildcaredata.github.io/data/providerdata.json).

If you want to set up an instance of this locally, after installing, kick off a sync to the EEC site like so:

    make data/providerdata.json

License
-------

MIT.
