import sys, json, csv
from random import randint, choice, uniform, random, sample

# read the number of filters to add from the input arguments
numFilters = sys.argv[1]

cr = csv.reader(open("./iso-codes.csv","rb"))
countries={}
i = 0
for row in cr:
	v, k = row
	countries[i] = v
	i = i +1

# function to generate a random name
def name_generator(size=6, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))


# create a JSON object
jsonArray = []

for i in range(int(numFilters)):
	# create a new filter
	jsonObject = {}
	# name
	jsonObject['name'] = name_generator()
	# values
	jsonObject['values'] = 'YEAR'
	jsonArray.append(jsonObject)

with open('test-filters.json', 'w') as outfile:
    json.dump(jsonArray, outfile)
