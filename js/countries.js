var Country = function(countryObject, name, count) {
	if(countryObject == '') {
		// read from the input parameters
		this.Country = name;
		// + is used to assure that a Number is being read
		this.Count = +count;
		this.Var = 0;
		this.desc = 'abc';
	} else {
		// read from the JSON
		var hasName = true;
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			if(countryObject[currentNameToCheck] === undefined) {
				hasName = false;
			} else {
				this[currentNameToCheck] = countryObject[currentNameToCheck];
				this[currentValue] = countryObject[currentValue];
			}
		} while (hasName);

		this.Country = countryObject.Country;
		// + is used to assure that a Number is being read
		this.Count = +countryObject.Count;
		this.Var = countryObject.Var;
		this.desc = 'abc';
	}

};

function generateColorsForTheCountries(countries) {
	if(!countries)
		countries = jsonCountries;
	var countryColors = [];
	$.each(countries, function(index, currentCountry) {
		countryColors[currentCountry.Country] = currentCountry.Count;
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
