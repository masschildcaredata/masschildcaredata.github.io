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
	(node sync/geodataget.js data/providerdata.json > data/geocodedproviders.json) >& data/geocode_errors.txt

data/finda-data.json: data/geocodedproviders.json
	node sync/get-finda-data.js data/geocodedproviders.json > data/finda-data.json

data/geocoded-providers-summarized.json: data/geocodedproviders.json
	node sync/summarize-geocoded-providers.js data/geocodedproviders.json > data/geocoded-providers-summarized.json

data/line-delimited-summary.json: data/geocodedproviders.json
	node sync/summarize-geocoded-providers.js data/geocodedproviders.json --ldjson  > data/line-delimited-summary.json

clean-data:
	rm data/*

# update-dat: data/geocodedproviders.json
# 	cd data/dat && cat ../geocodedproviders.json | dat import --json --primary=providerid
# 	cd ../..

# api/search-index/datindex.db: data/dat/.dat
# 	cp -r data/dat/.dat api/search-index/datindex.db

# sync-index: api/search-index/datindex.db
# 	node api/search-index/indexdatdb.js data/dat api/search-index/dat.db

test:
	node tests/provider-to-finda-data-point-tests.js 
