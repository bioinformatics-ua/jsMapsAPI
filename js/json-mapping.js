var mappingMarkers = [];
var mappingCountries = [];

VectorialMap.prototype.registerTransformer = function(jsonLocation, countriesMappingJson, markersMappingJson) {
	// jsonLocation - url of the new json
	// countriesMappingJson - json that contains the json country mapping
	var countriesMappingJson = "../mappingJSON/mappingCountriesSample.json";
	// markersMappingJson - json that contains the json markers mapping
	var markersMappingJson = "../mappingJSON/mappingMarkersSample.json";

	if(!countriesMappingJson) {
		console.error('you must specify a countries mapping json');
		return;
	}
	if(!markersMappingJson) {
		console.error('you must specify a markers mapping json');
		return;
	}

	// get the JSON
	jsonLocation = "../json/espid-spain.json";
	$.getJSON(jsonLocation, function(json) {
		// read countries
		jsonMapCountries(json, countriesMappingJson);
		// read markers
		jsonMapMarkers(json, markersMappingJson);
	});
}

function jsonMapCountries(json, countriesMappingJson) {
	var countries = [];
	// access the JSON file that specifies the mapping
	$.getJSON(countriesMappingJson, function(jsonMapping) {

		// in this case the 'countries' are defined the top level
		// iterate through every 'country'
		$.each(json, function(index, currentJSON) {
			var jsonCountry = '{';
			// get the name of the country
			var name = currentJSON[jsonMapping.country];
			// the country name must be on the two-digit format
			// get the count - WHAT IS THE COUNT?
			var count = 0;
			//get the description - WHT IS THE DESCRIPTION OF A MARKER?
			var description = '';
			/*
			WHAT ARE THE NAMES???
			*/
			countries[index] = new Country('', name, count);
		});
		mappingCountries = countries;
		console.log(mappingCountries);
	});
}

function jsonMapMarkers(json, markersMappingJson) {
	var markers = [];

	// access the JSON file that specifies the mapping
	$.getJSON(markersMappingJson, function(jsonMapping) {
		// in this case the 'markers' are defined the top level
		// iterate through every 'marker'
		$.each(json, function(index, currentJSON) {
			// get the name of the country
			var name = currentJSON[jsonMapping.country];
			// the country name must be on the two-digit format
			// get the count - WHAT IS THE COUNT?
			var count = 0;
			// get the latitude
			var latitude = currentJSON[jsonMapping.Latitude];
			// get the longitude
			var longitude = currentJSON[jsonMapping.Longitude];
			//get the description - WHAT IS THE DESCRIPTION OF A MARKER?
			var description = '';
			/*
			WHAT ARE THE NAMES???
			*/
			// create a new marker
			markers[index] = new Marker('', name, count, latitude, longitude);
		});
		mappingMarkers = markers;
		console.log(mappingMarkers);
	});
}

VectorialMap.prototype.filterOnServer = function(filters) {
    // read the filters from a JSON file (just for testing)
    $.getJSON("../json/serverFilter.json", function(filtersJSON) {
        // convert the filtersJSON to a string
        var filtersString = JSON.stringify(filtersJSON);
        // build the url to send to the server
        var url = 'http://serverFiltering.com/?data=' + encodeURIComponent(filtersString);
        // FOR TESTING PURPOSES - this file contains a different set
        // of countries and markers
        url = '../json/countries_plus_markers2.json';
        // send request to the server to get the markers and countries
        $.getJSON(url, function(json) {
            // get the response from the server
            /*
            THIS CODE IS SERVER SIDE
            var myParam = url.split('data=')[1];
            var returnJSON = decodeURIComponent(myParam);
            console.log(JSON.parse(returnJSON));
            */

            // parse the JSON to get the countries and markers
            jsonCountries = readCountriesFromJSON(json.countries);
            // get the colours for the countries
            var countryColors = generateColorsForTheCountries(jsonCountries);
            // display the countries on the map
            reloadMap(countryColors);

            // in case we also have markers
            if (json.markers) {
                // read the markers from the JSON file
                jsonMarkers = readMarkersFromJSON(json.markers);
                // add markers to the map
                addMarkersToMap();
            }
        });
    });
}
