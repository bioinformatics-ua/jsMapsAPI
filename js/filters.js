// Filter definition
var Filter = function (Name, Value, Values) {
	this.Name = Name;
	this.Value = Value;
	this.Values = Values;
};

var countryColors = [];

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

	// check what countries and markers should be shown on the map
	$.each(finalParts, function (index, part) {
		applyFilter(filterObject, part);
	});

	// reload the map
	reloadMap(countryColors);
}

function applyFilter(selectedFilter, filterValue) {

	// check what countries to colour
	$.each(jsonCountries, function (index, currentCountry) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentCountry[currentNameToCheck] !== undefined) {
				if(currentCountry[currentNameToCheck] === selectedFilter.Name) {
					// check by value
					if(currentCountry[currentValue] == filterValue) {
						countryColors[currentCountry.Country] = currentCountry.Count;
					}
				}
			} else
				break;
		} while (true)
	});

	// reload the map with the correct countries highlighted
	// reloadMap(colors);

	// add only the markers who have that filter value
	$.each(jsonMarkers, function (index, currentMarker) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentMarker[currentNameToCheck] !== undefined) {
				if(currentMarker[currentNameToCheck] == selectedFilter.Name) {
					if(currentMarker[currentValue] == filterValue) {
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

	/*
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
	    */
}


function checkFilterNameIsValid(filterName) {
	var valid = false;
	$.each(jsonFiltersArray, function (index, currentFilter) {
		if(currentFilter.Name.toLowerCase() === filterName.toLowerCase()) {
			filterObject = currentFilter;
			valid = true;
			return;
		}
	});
	return valid;
}

function checkFilterValueIsValid(filter, parts) {
	var valid = false;
	$.each(parts, function (index, part) {
		// check if the current value is valid
		$.each(filterObject.Values, function (index, currentValue) {
			if(currentValue == part) {
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
	// check we have an enumeration (comma-separated values and/or ranges)
	var returnParts = [];
	if(String(filterValue).indexOf(",") != -1) {
		// check if every individual value and/or range is valid
		var parts = String(filterValue).split(",");
		//returnParts.push(parts);

		// check if we have a simple value or a range
		$.each(parts, function (index, currentPart) {
			if(currentPart.indexOf("-") != -1) {
				// we have a range
				var subParts = String(currentPart).split("-");
				// check if the extreme values are valid
				checkFilterValueIsValid(filterObject, subParts);
				// get all the values between those two numbers
				var min = subParts[0];
				var max = subParts[1];
				for(; min <= max; min++) {
					returnParts.push(min);
				}
			} else
				returnParts.push(currentPart);
		});
	} else {
		// just a single part
		if(filterValue.indexOf("-") != -1) {
			// we have a range
			var subParts = String(filterValue).split("-");
			// check if the extreme values are valid
			checkFilterValueIsValid(filterObject, subParts);
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
	colors = [];
	$.each(jsonCountries, function (index, currentCountry) {
		colors[currentCountry.Country] = currentCountry.Count;
	});

	reloadMap(colors);

	// add only the markers who have that filter value
	$.each(jsonMarkers, function (index, currentMarker) {
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


function setFilters(jsonFilters, filterType) {

	function setMenu() {
		$.each(jsonFilters, function (index, currentFilter) {
			var filterName = currentFilter.Name;

			var toAppend = '';
			toAppend += '<li>' + filterName + '<ul>';
			// add all the values from the filters
			$.each(currentFilter.Values, function (i, currentValue) {
				toAppend += '<li filter_index=' + index + '>' + currentValue + '</li>';
			});
			toAppend += '</ul></li>';
			$('#jquerymenu').append(toAppend);
		});

		// set the element to behave as a menu
		$("#jquerymenu").menu();

		// triggered when an item is selected
		$("#jquerymenu").on("menuselect", function (event, ui) {
			// selected filter
			var selectedFilter = jsonFilters[ui.item.attr('filter_index')];
			// selected value for the filter
			var filterValue = ui.item.text();
			// apply filtering
			filterSelected(selectedFilter, filterValue);
		});
	}

	function setRadioButtons() {
		$.each(jsonFilters, function (index, currentFilter) {
			var filterName = currentFilter.Name;
			var toAppend = '';
			// add all the values from the filters
			toAppend += '<input type="radio" id="radio' + Number(index + 1) + '" name="radio">';
			toAppend += '<label for = "radio' + Number(index + 1) + '">' + filterName + ' </label>';
			$('#radioButtons').append(toAppend);
		});

		// set the element to behave as a menu
		$("#radioButtons").buttonset();

		// triggered when an item is selected
		$("#search_button").click(function () {
			// check what is on the search box
			var searchText = $('#search_text').val();
			if(searchText === '')
				alert('You must enter a search text');
			else
				console.log('searching for ' + searchText);

			// get the selected radio button

		});
	}
	switch(filterType) {
	case 'menu':
		$('#checkboxes_search').hide();
		setMenu();
		break;
	case 'radio':
		$('#jquerymenu').hide();
		setRadioButtons();
		break;
	default:
		console.log('not supported filter')
		break;
	}
}

function filterSelected(selectedFilter, filterValue) {

	// check what countries to colour
	colors = [];
	selectedCountries = [];
	map.series.regions[0].setValues([]);
	$.each(jsonCountries, function (index, currentCountry) {
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentCountry[currentNameToCheck] !== undefined) {
				if(currentCountry[currentNameToCheck] === selectedFilter.Name) {
					// check by value
					if(currentCountry[currentValue] == filterValue) {
						colors[currentCountry.Country] = currentCountry.Count;
						selectedCountries.push(currentCountry);
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
	$.each(jsonMarkers, function (index, currentMarker) {
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

	// set the text on the UI
	$('#minSlider').text(min);
	$('#maxSlider').text(max);

	// filter the Countries
	colors = [];
	$.each(selectedCountries, function (index, currentCountry) {
		if(currentCountry[selectedName] >= min && currentCountry[selectedName] <= max)
			colors[currentCountry.Country] = currentCountry.Count;
	});

	reloadMap(colors);

	// filter the Markers
	// first, remove all markers
	map.removeAllMarkers();

	// add only the markers who have that filter value
	$.each(jsonMarkers, function (index, currentMarker) {
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
