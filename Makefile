data/listings.txt:
	node sync/getproviderlistings.js > data/listings.txt

data/details.json:
	node sync/basedetailsget.js > data/details.json

data/links.json: data/details.json
	node sync/linkget.js data/details.json > data/links.json

data/bodies.json: data/details.json
	node sync/getbodiesfordetails.js data/details.json > data/bodies.json

data/providerdata.json: data/bodies.json data/details.json
	node sync/datafrombodies data/bodies.json data/details.json > data/providerdata.json

clean-data:
	rm data/*

# cat ../providerdata.json | dat --json
