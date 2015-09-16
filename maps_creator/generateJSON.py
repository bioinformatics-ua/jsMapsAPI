import sys, json, csv
from random import randint, choice, uniform, random, sample
import os

cr = csv.reader(open("./iso-codes.csv","rb"))
countries=[]

for row in cr:
	v, k = row
	countries.append(v)

	jsonFile = {
	  "input_file": "./states_provinces/ne_10m_admin_1_states_provinces.shp",
	  "name_field": "name",
	  "code_field": "iso_a2",
	  "name": "world",
	  "input_file_encoding": "utf-8"
	}

	jsonFile["output_file"] = "./created_countries/" + v.lower() +".js"
	jsonFile["where"] = "iso_a2 = '" + v +"'"
	jsonFile["name"] = v.lower()
	
	
	# write json files
	jsonLocation = './json/' + v.lower() +'-map.json'
	with open(jsonLocation, 'w') as outfile:
		json.dump(jsonFile, outfile)
		
	# run converter for every json file
	os.system("python converter.py " + jsonLocation)
