data/listings.txt:
	node sync/getproviderlistings.js > data/listings.txt

data/details.json:
	node sync/basedetailsget.js data/listings.txt > data/details.json

data/links.json: data/details.json
	node sync/linkget.js data/details.json > data/links.json

data/bodies.json: data/details.json
	node sync/getbodiesfordetails.js data/details.json > data/bodies.json

data/providerdata.json: data/bodies.json data/details.json
	node sync/datafrombodies data/bodies.json data/details.json > data/providerdata.json

data/geocodedproviders.json: data/providerdata.json
	node sync/geodataget.js data/providerdata.json > data/geocodedproviders.json

clean-data:
	rm data/*

update-dat: data/geocodedproviders.json
	cd data/dat && cat ../geocodedproviders.json | dat import --json --primary=providerid
	cd ../..
