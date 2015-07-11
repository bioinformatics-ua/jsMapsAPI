import sys, json, csv
from random import randint, choice, uniform, random, sample

# read the number of countries to add from the input arguments
numCountries = sys.argv[1]

cr = csv.reader(open("./iso-codes.csv","rb"))
countries=[]
i = 0
for row in cr:
	v, k = row
	countries.append(v)

# create a JSON object
jsonArray = []

for i in range(int(numCountries)):
	# create a new country
	jsonObject = {}
	jsonObject['Count'] = randint(1000,2000)
	jsonObject['Name1'] = 'YEAR'
	jsonObject['Value1'] = randint(1980,2015)
	jsonObject['Name2'] = 'Gender'
	jsonObject['Value2'] = sample(['F','M','T'], 1)
	selectedCountry = choice(countries)
	countries.remove(selectedCountry)
	jsonObject['Country'] = selectedCountry
	jsonArray.append(jsonObject)

with open('test-countries.json', 'w') as outfile:
    json.dump(jsonArray, outfile)
