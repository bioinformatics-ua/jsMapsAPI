import sys, json, csv
from random import randint, choice, uniform, random, sample

# read the number of markers to add from the input arguments
numMarkers = sys.argv[1]

cr = csv.reader(open("./iso-codes.csv","rb"))
countries={}
i = 0
for row in cr:
	v, k = row
	countries[i] = v
	i = i +1

# create a JSON object
jsonArray = []

for i in range(int(numMarkers)):
	# create a new marker
	jsonObject = {}
	jsonObject['Count'] = randint(1000,2000)
	jsonObject['Name1'] = 'YEAR'
	jsonObject['Value1'] = randint(1980,2015)
	jsonObject['Name2'] = 'Gender'
	jsonObject['Value2'] = sample(['F','M','T'], 1)
	jsonObject['Country'] = choice(countries)
	jsonObject['Latitude'] = uniform(-90, 90)
	jsonObject['Longitude'] = uniform(-180, 180)
	jsonArray.append(jsonObject)

with open('test-filters.json', 'w') as outfile:
    json.dump(jsonArray, outfile)
