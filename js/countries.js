var Country = function(countryObject, name, count) {
	if(countryObject == '') {
		// read from the input parameters
		this.country = name;
		// + is used to assure that a Number is being read
		this.Count = +count;
		this.Var = 0;
		this.desc = 'abc';
	} else {
		// read from the JSON
		// add attributes
		var attributes = countryObject["attributes"];
		var country = this;
		$.each(Object.keys(attributes), function(index, attr) {
			country[attr] = attributes[attr];
		});

		// try to read its regions in case he has any
		if(countryObject.Regions)
			this.Regions = readRegionsFromJSON(countryObject.Regions, countryObject.country);

		this.country = countryObject.country;
		// + is used to assure that a Number is being read
		this.count = +countryObject.count;
		this.desc = 'abc';
	}
};

function generateColorsForTheCountries(countries) {
	if(!countries)
		countries = jsonCountries;
	var countryColors = [];
	$.each(countries, function(index, currentCountry) {
		countryColors[currentCountry.country] = currentCountry.count;
	});
	return countryColors;
};

function readCountriesFromJSON(markers) {

	var countries = [];
	var numJSONCountries = markers.length;

	minCount = Infinity;
	maxCount = -Infinity;

	$.each(markers, function(index, currentCountry) {
		countries[index] = new Country(currentCountry);

		if(countries[index].Count > maxCount)
			maxCount = countries[index].Count;

		if(countries[index].Count < minCount)
			minCount = countries[index].Count;
	});
	return countries;
}

// return the country whose name is passed as an argument
function findCountryByName(countryName)
{
	var returnCountry = null;
	$.each(jsonCountries, function(index, currentCountry) {
		if(currentCountry.country == countryName)
		{
			returnCountry = currentCountry;
			return returnCountry;
		}
	});
	return returnCountry;
}

// read the min and max count of the countris
function readMinMax(countriesNames)
{
	minCount = Infinity;
	maxCount = -Infinity;

	// countries names is a JSON object
	// read keys to an array
	var keys = [];
	for (var key in countriesNames) {
	  if (countriesNames.hasOwnProperty(key)) {
	    keys.push(key);
	  }
	}

	// find country by name
	$.each(keys, function(index, currentCountryName) {
		// find the country by its name
		var currentCountry = findCountryByName(currentCountryName);
		if(currentCountry.Count > maxCount)
			maxCount = currentCountry.Count;

		if(currentCountry.Count < minCount)
			minCount = currentCountry.Count;
	});
}
