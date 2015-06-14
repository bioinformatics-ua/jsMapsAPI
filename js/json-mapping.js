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
	// access the JSON file that specifies the mapping
	$.getJSON("../mappingJSON/mappingMarkersSample.json", function(jsonMapping) {

		// in this case the 'markers' are defined the top level
		console.log(json.length);
		// iterate through every 'marker'
		$.each(json, function(index, currentJSON) {
			// get the name of the country
			var name = currentJSON[jsonMapping.Country];
			// the country name must be on the two-digit format
			// get the count - WHAT IS THE COUNT?
			var count = 0;
			// get the latitude
			var latitude = currentJSON[jsonMapping.Latitude];
			// get the longitude
			var longitude = currentJSON[jsonMapping.Longitude];
			//get the description - WHT IS THE DESCRIPTION OF A MARKER?
			var description = '';
			/*
			WHAT ARE THE NAMES???
			*/
			console.log(name+' '+latitude+' '+longitude);

		});
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
