function multiFilter(inputArgs) {

	var keys = Object.keys(inputArgs)
	var numberKeys = keys.length;

	console.log(inputArgs)
	console.log(numberKeys);

	var validFilters = 0;
	var countryColors = [];

	// for every key
	$.each(keys, function(index, filterName) {
		var filterValue = inputArgs[filterName];

		// check the currentKey
		if(filterName.toLowerCase() == 'all') {
			console.log('removing all applied filters')
			resetFilters();
			return;
		}

		// check if the filterName is valid
		if(!checkFilterNameIsValid(filterName)) {
			// invalid filter name
			console.log('Invalid filter name!(' + filterName);
		} else {
			// if valid, check the filterValue
			var finalParts = getAllFilterValues(filterValue);
			console.log(finalParts);
			validFilters++;

			$.each(finalParts, function(index, part) {
				var checkReturn = checkWhatCountriesMarkersToAdd(filterObject, part);
				var returnColorsJSON = checkReturn[0];
				var markersToMap = checkReturn[1];
				// add elements to countryColors
				console.log('return colors');
				console.log(Object.keys(checkReturn[0]));
				$.each(Object.keys(checkReturn[0]), function(index, currentKey) {
					// the colors that are returned are in a json format
					var keyValue = checkReturn[0][currentKey];
					countryColors[currentKey] = keyValue;
				});
			});
		}
	});

	console.log(countryColors);
	reloadMap(countryColors);

	// add markers to Map

}

function applyMultipleFiltersProgramattically(filtersToApply) {

	console.log('Filters to apply: ' + filtersToApply);

	var keys = Object.keys(filtersToApply)
	var numFiltersToApply = keys.length;
	var countriesHaveFilter = [];
	var markersHaveFilter = [];

	// for every key
	$.each(keys, function(index, filterName) {
		var filterValue = filtersToApply[filterName];
	});
	var colors = [];

	// remove all markers from the map
	map.removeAllMarkers();

	// for each of the countries
	$.each(jsonCountries, function(countryIndex, currentCountry) {
		// set to 0 the number of filters
		countriesHaveFilter[countryIndex] = 0;
		// check if it has the needed values
		$.each(keys, function(index, currentFilterName) {
			var i = 0;
			do {
				i++;
				var currentNameToCheck = 'Name' + i;
				var currentValue = 'Value' + i;
				// check if the Country has that name
				if(!currentCountry[currentNameToCheck])
					break;

				if(currentCountry[currentNameToCheck].toLowerCase() == currentFilterName.toLowerCase()) {
					// check by value
					if(currentCountry[currentValue] == filtersToApply[currentFilterName])
						countriesHaveFilter[countryIndex]++;
				}
			} while (true)
		});
	});

	// colour only the countris whose countriesHaveFilter[index] == numberFilters
	$.each(jsonCountries, function(countryIndex, currentCountry) {
		if(countriesHaveFilter[countryIndex] == numFiltersToApply) {
			colors[currentCountry.Country] = currentCountry.Count;
		}
	});
	reloadMap(colors);

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
	Markers
	*/
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// for each of the markers
	$.each(jsonMarkers, function(markerIndex, currentMarker) {
		// set to 0 the number of filters
		markersHaveFilter[markerIndex] = 0;
		// check if it has the needed values
		$.each(keys, function(index, currentFilterName) {
			var i = 0;
			do {
				i++;
				var currentNameToCheck = 'Name' + i;
				var currentValue = 'Value' + i;
				// check if the Country has that name
				if(!currentMarker[currentNameToCheck])
					break;

				if(currentMarker[currentNameToCheck].toLowerCase() == currentFilterName.toLowerCase()) {
					// check by value
					if(currentMarker[currentValue] == filtersToApply[currentFilterName])
						markersHaveFilter[markerIndex]++;
				}
			} while (true)
		});
	});

	// add only the markers who satisfy the criteria
	$.each(jsonMarkers, function(index, currentMarker) {
		if(markersHaveFilter[index] == numFiltersToApply) {
			map.addMarker(index, {
				latLng: [currentMarker.Latitude, currentMarker.Longitude],
				name: currentMarker.desc,

				// set the style for this marker
				style: {
					fill: 'green',
					r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
				}
			});
		}
	});

}

function applyMultipleFilters(selectedMultipleFilters, jsonFilters) {

	// number of filters to be applied
	var numFiltersToApply = selectedMultipleFilters.filter(function(value) {
		return value !== undefined
	}).length;

	var countriesHaveFilter = [];
	var markersHaveFilter = [];

	// for each of the countries
	$.each(jsonCountries, function(countryIndex, currentCountry) {
		// set to 0 the number of filters
		countriesHaveFilter[countryIndex] = 0;
		// check if it has the needed values
		$.each(selectedMultipleFilters, function(index, currentFilterValue) {
			var i = 0;
			do {
				i++;
				var currentNameToCheck = 'Name' + i;
				var currentValue = 'Value' + i;
				// check if the Country has that name
				if(currentCountry[currentNameToCheck] == undefined)
					break;

				if(currentCountry[currentNameToCheck] === jsonFilters[index].Name) {
					// check by value
					if(currentCountry[currentValue] == currentFilterValue) {
						countriesHaveFilter[countryIndex]++;
					}
				}
			} while (true)
		});
	});

	var colors = [];

	// colour only the countris whose countriesHaveFilter[index] == numberFilters
	$.each(jsonCountries, function(countryIndex, currentCountry) {
		if(countriesHaveFilter[countryIndex] == numFiltersToApply)
			colors[currentCountry.Country] = currentCountry.Count;
	});

	// colour the countries
	reloadMap(colors);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	/*
	Markers
	*/
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// for each of the markers
	$.each(jsonMarkers, function(markerIndex, currentMarker) {
		// set to 0 the number of filters
		markersHaveFilter[markerIndex] = 0;
		// check if it has the needed values
		$.each(selectedMultipleFilters, function(index, currentFilterValue) {
			var i = 0;
			do {
				i++;
				var currentNameToCheck = 'Name' + i;
				var currentValue = 'Value' + i;
				// check if the Country has that name
				if(!currentMarker[currentNameToCheck])
					break;

				if(currentMarker[currentNameToCheck].toLowerCase() == jsonFilters[index].Name.toLowerCase()) {
					// check by value
					if(currentMarker[currentValue] == currentFilterValue)
						markersHaveFilter[markerIndex]++;
				}
			} while (true)
		});
	});

	// add only the markers who satisfy the criteria
	$.each(jsonMarkers, function(index, currentMarker) {
		if(markersHaveFilter[index] == numFiltersToApply) {
			map.addMarker(index, {
				latLng: [currentMarker.Latitude, currentMarker.Longitude],
				name: currentMarker.desc,

				// set the style for this marker
				style: {
					fill: 'green',
					r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
				}
			});
		}
	});
}
