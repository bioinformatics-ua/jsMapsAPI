// Filter definition
var Filter = function(Name, Value, Values) {
	this.Name = Name;
	this.Value = Value;
	this.Values = Values;
};

var currentFilter;
var markersToAdd = [];

function filter(filterName, filterValue) {

	// check the filterName
	if(filterName.toLowerCase() == 'all') {
		console.log('removing all applied filters')
		resetFilters();
		return;
	}

	// check if the filterName is valid
	if(!checkFilterNameIsValid(filterName)) {
		// invalid filter name
		console.log('Invalid filter name!');
		return;
	}

	// get all the filter values
	var finalParts = getAllFilterValues(filterValue);
	console.log('Filter values: ' + finalParts);

	// remove all markers from the map
	map.removeAllMarkers();

	// apply the filtering
	countryColors = [];
	markersToAdd = [];

	// check what countries and markers should be shown on the map
	$.each(finalParts, function(index, part) {
		checkWhatCountriesMarkersToAdd(filterObject, part);
	});

	// reload the map
	reloadMap(countryColors);

	/*
		add the markers
	this must be done here because reload map erases all the markers
	*/
	addMarkersToMap(markersToAdd);
}

function checkWhatCountriesMarkersToAdd(selectedFilter, filterValue) {

	var countriesToAddColors = [];
	var markersToAddToMap = [];

	// check what countries to colour
	$.each(jsonCountries, function(index, currentCountry) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentCountry[currentNameToCheck]) {
				if(currentCountry[currentNameToCheck] === selectedFilter.Name) {
					// check by value
					if(currentCountry[currentValue] == filterValue) {
						//countryColors[currentCountry.Country] = currentCountry.Count;
						countriesToAddColors[currentCountry.Country] = currentCountry.Count;
					}
				}
			} else
				break;
		} while (true)
	});

	// add only the markers who have that filter value
	$.each(jsonMarkers, function(index, currentMarker) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentMarker[currentNameToCheck]) {
				if(currentMarker[currentNameToCheck] == selectedFilter.Name) {
					if(currentMarker[currentValue] == filterValue)
						//markersToAdd.push(currentMarker);
						markersToAddToMap.push(currentMarker);
				}
			} else {
				break;
			}
		} while (true)
	});

	return [countriesToAddColors, markersToAddToMap];
}

function checkFilterNameIsValid(filterName) {
	var valid = false;
	$.each(jsonFiltersArray, function(index, currentFilter) {
		if(currentFilter.Name.toLowerCase() === filterName.toLowerCase()) {
			filterObject = currentFilter;
			valid = true;
			return;
		}
	});
	return valid;
}

function checkFilterValuesAreValid(filter, filterValues) {
	var valid = false;
	$.each(filterValues, function(index, part) {
		// check if the current value is valid
		$.each(filterObject.Values, function(index, currentValue) {
			if(currentValue == part) {
				console.log(currentValue + ' valid');
				valid = true;
				return;
			}
		});
		if(!valid) {
			console.log('Invalid value for the filter: ' + part);
			return;
		}
	});
	return valid;
}

function getAllFilterValues(filterValue) {
	var returnParts = [];

	// check if we have an enumeration (comma-separated values and/or ranges)
	if(String(filterValue).indexOf(",") != -1) {

		// get all the enumerated values (can be singular or range)
		var enumerationParts = String(filterValue).split(",");

		// check if we have a simple value or a range
		$.each(enumerationParts, function(index, currentEnumeration) {

			// if we have a range...
			if(currentEnumeration.indexOf("-") != -1) {

				// all the range parts
				var rangeParts = String(currentEnumeration).split("-");

				// check if the extreme values are valid
				checkFilterValuesAreValid(filterObject, rangeParts);

				// get all the values between those two numbers
				// and add them
				var min = rangeParts[0];
				var max = rangeParts[1];
				for(; min <= max; min++)
					returnParts.push(min);

			} else {
				// if we don't have a range
				// check if the single value is valid
				returnParts.push(currentEnumeration);

			}
		});
	} else {
		// just a single part
		if(filterValue.indexOf("-") != -1) {
			// we have a range
			var subParts = String(filterValue).split("-");
			// check if the extreme values are valid
			checkFilterValuesAreValid(filterObject, subParts);
			// get all the values between those two numbers
			var min = subParts[0];
			var max = subParts[1];
			for(; min <= max; min++) {
				returnParts.push(min);
			}
		} else
			returnParts.push(filterValue);
	}
	return returnParts;
}

function resetFilters() {
	// color the original map
	var colors = generateColorsForTheCountries();
	reloadMap(colors);

	// add only the markers who have that filter value
	$.each(jsonMarkers, function(index, currentMarker) {
		map.addMarker(index, {
			latLng: [currentMarker.Latitude, currentMarker.Longitude],
			name: currentMarker.desc,

			// set the style for this marker
			style: {
				fill: 'green',
				r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
			}
		});
	});
}

var countryValueToCheck;

function filterSelected(selectedFilter, filterValue) {

	currentFilter = selectedFilter;
	// check what countries to colour
	colors = [];
	selectedCountries = [];
	map.series.regions[0].setValues([]);
	$.each(jsonCountries, function(index, currentCountry) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentCountry[currentNameToCheck]) {
				if(currentCountry[currentNameToCheck] === selectedFilter.Name) {
					// check by value
					if(currentCountry[currentValue] == filterValue) {
						colors[currentCountry.Country] = currentCountry.Count;
						selectedCountries.push(currentCountry);
						countryValueToCheck = currentValue;
					}
				}
			} else
				break;
		} while (true)
	});
	reloadMap(colors);

	// remove all markers from the map
	map.removeAllMarkers();

	// add only the markers who have that filter value
	$.each(jsonMarkers, function(index, currentMarker) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentMarker[currentNameToCheck] !== undefined) {
				if(currentMarker[currentNameToCheck] === selectedFilter.Name) {
					if(currentMarker[currentValue] === filterValue) {
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
				}
			} else {
				break;
			}
		} while (true)
	});


	// update the slider
	// check if any of the values is a numbers, if it is we then update the slider
	if(!isNaN(selectedFilter.Values[0])) {
		$('#slider').show();
		$('#minSlider').show();
		$('#maxSlider').show();

		// jQueryUI slider
		var slider = $("#slider").slider();
		var minValue = selectedFilter.Values[0];
		var maxValue = selectedFilter.Values[selectedFilter.Values.length - 1];

		// set max and min value for the slider
		slider.slider("option", "min", minValue);
		slider.slider("option", "max", maxValue);

		// set the text on the UI
		$('#minSlider').text(minValue);
		$('#maxSlider').text(maxValue);
	} else {
		$('#slider').hide();
		$('#minSlider').hide();
		$('#maxSlider').hide();
	}
}

function sliderChanged() {
	// get the max and min values for the currently selected range
	var currentRange = slider.slider("option", "values");
	var min = currentRange[0];
	var max = currentRange[1];

	var currentFilterName = currentFilter.Name;

	// set the text on the UI
	$('#minSlider').text(min);
	$('#maxSlider').text(max);



	// filter the Countries
	colors = [];
	$.each(jsonCountries, function(index, currentCountry) {
		var filterValueForCountry = +currentCountry[countryValueToCheck];
		if(filterValueForCountry >= min && filterValueForCountry <= max)
			colors[currentCountry.Country] = currentCountry.Count;
	});

	// draw the countries on the map
	reloadMap(colors);

	// filter the Markers - first, remove all markers
	map.removeAllMarkers();

	// add only the markers who have that filter value
	$.each(jsonMarkers, function(index, currentMarker) {
		// check if the Country has that name
		if(currentMarker[selectedName] >= min && currentMarker[selectedName] <= max) {
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
};

function readFiltersFromJSON(inputFilters) {
	var filtersReturn = [];

	// read filters from JSON
	for(var i = 0; i < inputFilters.values.length; i++) {
		// read the current filter
		currentFilter = inputFilters.values[i];
		// fields
		var name = currentFilter.name;
		var value = currentFilter.value;
		var values = [];

		for(var j = 0; j < currentFilter.values.length; j++)
			values.push(currentFilter.values[j]);
		filtersReturn[i] = new Filter(name, value, values);
	}
	return filtersReturn;
};
