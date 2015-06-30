// create a new FIlter object
var Filter = function(Name, Value, Values) {
	this.Name = Name;
	this.Value = Value;
	this.Values = Values;
};

// number of filters
var numFilters;
var currentFilter;
var countryValueToCheck;

/*
function filter2(filterName, filterValue) {

	var markersToAdd = [];

	// check the filterName
	if(filterName.toLowerCase() == 'all') {
		console.log('removing all applied filters')
			// reloads the original markers and countries on the map
		resetFilters();
		// erase the text from the filters box
		resetFiltersBox();
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

	// apply the filtering
	countryColors = [];
	markersToAdd = [];

	// check what countries and markers should be shown on the map
	$.each(finalParts, function(index, part) {
		checkWhatCountriesMarkersToAdd(filterObject, part);
	});

	// reload the map
	reloadMap(countryColors);

	//add the markers
	//this must be done here because reload map erases all the markers
	addMarkersToMap(markersToAdd);
}
*/

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

function filterFromMenuSelected(selectedFilter, filterValue) {

	currentFilter = selectedFilter;

	// check what countries to add to the map
	var countries = checkWhatCountriesToAdd(selectedFilter, filterValue);

	// reload the map and add those countries
	reloadMap(countries);

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
	var countries = [];
	$.each(jsonCountries, function(index, currentCountry) {
		var filterValueForCountry = +currentCountry[countryValueToCheck];
		if(filterValueForCountry >= min && filterValueForCountry <= max)
			countries[currentCountry.Country] = currentCountry.Count;
	});

	// draw the countries on the map
	reloadMap(countries);

	// filter the Markers
	var currentCountry = jsonCountries[0];
	var selectedName;
	var i = 0;
	do {
		i++;
		var currentNameToCheck = 'Name' + i;
		var currentValue = 'Value' + i;
		// check if the Country has that name
		if(currentCountry[currentNameToCheck] === currentFilterName) {
			selectedName = currentValue;
			break;
		}
	} while (true);

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
	var filters = [];

	for(var i = 0; i < inputFilters.values.length; i++) {
		// read the current filter
		currentFilter = inputFilters.values[i];
		// fields
		var name = currentFilter.name;
		var value = currentFilter.value;
		var values = [];

		for(var j = 0; j < currentFilter.values.length; j++)
			values.push(currentFilter.values[j]);
		filters[i] = new Filter(name, value, values);
	}
	numFilters = filters.length;
	return filters;
};
