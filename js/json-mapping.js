VectorialMap.prototype.registerTransformer = function(jsonLocation) {
	// get the JSON
	$.getJSON("../json/espid-spain.json", function(json) {
		console.log(json);

		// map the markers
		// the programmer must indicate where the countries are
		var markers = jsonMapMarkers(json);
	});
}

function jsonMapMarkers(json) {
	// in this case the 'markers' are defined the top level
	console.log(json.length);
	// iterate through every 'marker'
	$.each(json, function(index, currentJSON) {
		/* MARKERS ATTRIBUTES
			Count: 31
			Country: "PT"
			Latitude: 80
			Longitude: 21
			Name1: "YEAR"
			Name2: "Gender"
			Value1: "2004"
			Value2: "T"
			Var: "Active patients"
			desc: "abc"
		*/
		// get the name of the country
		var name = currentJSON['country'];
		// get the count
		var count = 0;
		// get the latitude
		var latitude = currentJSON['latitude'];
		// get the longitude
		var longitude = currentJSON['longitude'];
		//get the description

	});
	var finalJSON;
	return finalJSON;
}

function jsonMapping(originalJSON) {
	var finalJSON;
	// map the countries
	// indicate where the 'countries' are in
	// the original JSON file


	// map the markers
	return finalJSON;
}

function jsonMapCountries(originalJSON) {
	var finalJSON;
	return finalJSON;
}
