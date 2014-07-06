data/details.json:
	node sync/basedetailsget.js > data/details.json

data/links.json: data/details.json
	node sync/linkget.js data/details.json > data/links.json

data/bodies.json: data/links.json
	node sync/bodiesfromlinks.js data/links.json > data/bodies.json

data/providerdata.json: data/bodies.json
	node sync/datafrombodies data/bodies.json > data/providerdata.json

clean-data:
	rm data/*
