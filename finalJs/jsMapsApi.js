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
function setFilters(jsonFilters, filterType) {

	function setMenu() {
		$.each(jsonFilters, function(index, currentFilter) {
			var filterName = currentFilter.Name;

			var toAppend = '';
			toAppend += '<li>' + filterName + '<ul>';
			// add all the values from the filters
			$.each(currentFilter.Values, function(i, currentValue) {
				toAppend += '<li filter_index=' + index + '>' + currentValue + '</li>';
			});
			toAppend += '</ul></li>';
			$('#jquerymenu').append(toAppend);
		});

		// set the element to behave as a menu
		$("#jquerymenu").menu();

		// triggered when an item is selected
		$("#jquerymenu").on("menuselect", function(event, ui) {
			// selected filter
			var selectedFilter = jsonFilters[ui.item.attr('filter_index')];
			// selected value for the filter
			var filterValue = ui.item.text();
			// apply filtering
			filterFromMenuSelected(selectedFilter, filterValue);
		});
	}

	function setRadioButtons() {
		$.each(jsonFilters, function(index, currentFilter) {
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
		$("#search_button").click(function() {
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

function createFiltersBox(jsonFilters) {

	var selectedMultipleFilters = [];

	// create filters box
	$.each(jsonFilters, function(index, currentFilter) {
		var filterName = currentFilter.Name.toLowerCase();
		filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
		var buttonId = 'dropdown' + index + 'button';
		var ulId = 'dropdown' + index;
		var toAppend = '';

		// filter text
		toAppend += '<p><b>' + filterName + ':</b></p>';
		// dropdown start
		toAppend += '<div class="dropdown">';
		// dropdown button
		toAppend += '<button id=' + buttonId + ' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>';
		// dropdown items
		toAppend += '<ul id=' + ulId + ' class="dropdown-menu">';
		$.each(currentFilter.Values, function(valueIndex, element) {
			toAppend += '<li><a href="#" filterIndex=' + index + ' index=' + valueIndex + '>' + element + ' </a></li>';
		});

		toAppend += '</ul></div>';
		$('#filters_box').prepend(toAppend);

		// add on click listener
		$("#" + ulId + " li a").click(function() {
			var filterIndex = $(this).attr('filterIndex');
			var selectedIndex = $(this).attr('index');
			//console.log('Filter: '+filterIndex+'; Value: '+selectedIndex);
			$("#" + buttonId + ":first-child").text($(this).text());
			$("#" + buttonId + ":first-child").val($(this).text());
			selectedMultipleFilters[filterIndex] = jsonFilters[filterIndex].Values[selectedIndex];
		});

		// add tooltip to the filters box
		$('#filters_box').tooltip({
			title: "Use this filter box to filter by multiple filters",
			placement: "bottom"
		});
	});

	// triggered when the search button is clicked
	$("#filter_box_apply_filters").click(function() {
		if(selectedMultipleFilters.length != 0)
			applyMultipleFilters(selectedMultipleFilters, jsonFilters);
	});

	// triggered when the reset button is clicked
	$("#filter_box_reset_filters").click(function() {

		// re-render dropdowns??

		// set the dropbown button text
		$(".filter-box-dropdown").text("Select a value");
		$(".filter-box-dropdown").val('Select a value');


		// reload the map
		var colors = [];
		$.each(jsonCountries, function(index, currentCountry) {
			colors[currentCountry.Country] = currentCountry.Count;
		});
		reloadMap(colors);

		// add all the markers to the map
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

	});
}

var resetFiltersBox = function() {

	// reset all the 'fboxes'
	for(var i = 0; i < numFilters; i++) {
		$("#fbox" + i).text('');
		$("#fbox" + i).val('');
	}

	// reload the map
	var colors = generateColorsForTheCountries();
	reloadMap(colors);

	// add all the markers to the map
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
};

function createFiltersBoxWithEnumeration(jsonFilters) {

	var numFilters = jsonFilters.length;

	// create filters box with enumeration
	$.each(jsonFilters, function(index, currentFilter) {
		var filterName = currentFilter.Name.toLowerCase();
		filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
		var buttonId = 'dropdown' + index + 'button';
		var ulId = 'dropdown' + index;
		var toAppend = '';

		// filter text
		toAppend += '<p><b>' + filterName + ':</b></p>';
		toAppend += '<div class="form-group">';
		toAppend += '<input type="text" class="form-control" id="fbox' + index + '"';
		// build the placeholder
		var placeholder = currentFilter.Values
		toAppend += 'placeholder="'+ placeholder+'" +>';
		toAppend += '</div>';

		$('#filters_box_enumeration').prepend(toAppend);

		// add Bootstrap tooltip to the filters box
		$('#filters_box_enumeration').tooltip({
			title: "Use this filter box to filter by multiple filters",
			placement: "bottom"
		});
	});

	// triggered when the search button is clicked
	$("#filters_box_enum_apply_filters").click(function() {
		var jsonText = '{';
		for(var i = 0; i < jsonFilters.length; i++) {
			// current and next filter id's
			var currentFilter = "#fbox" + i;
			var nextFilter = "#fbox" + (i + 1);
			// current and next filter values
			var currentFilterValue = $(currentFilter).val();
			var nextFilterValue = $(nextFilter).val();
			// check if we have any filtering to apply or not
			if(currentFilterValue !== '') {
				jsonText += '"' + jsonFilters[i].Name + '": "' + currentFilterValue + '"';
				// if we have one more value and it exists, add a comma
				if(nextFilterValue !== '' && $(nextFilter).length > 0)
					jsonText += ',';
			}
		}
		jsonText += '}';
		var filtersToApply = JSON.parse(jsonText);
		multiFilter(filtersToApply);
	});

	// triggered when the reset button is clicked
	$("#filters_box_enum_reset_filters").click(function() {
		resetFiltersBox();
	});
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

function checkWhatCountriesToAdd(selectedFilter, filterValue) {

	var countries = [];
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
				if(currentCountry[currentValue] == filterValue) {
					countryValueToCheck = currentValue;
					// check by value
					if(currentCountry[currentValue] == filterValue)
						countries[currentCountry.Country] = currentCountry.Count;
				}
			} else
				break;
		} while (true)
	});
	return countries;
};

function checkWhatMarkersToAdd(selectedFilter, filterValue) {
	var markers = [];
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
						markers.push(currentMarker);
				}
			} else {
				break;
			}
		} while (true)
	});

	return markers;
};

function checkWhatCountriesMarkersToAdd(selectedFilter, filterValue) {
	var countriesToAdd = [];
	var markersToAdd = [];

	// check what countries to colour
	countriesToAdd = checkWhatCountriesToAdd(selectedFilter, filterValue);
	markersToAdd = checkWhatMarkersToAdd(selectedFilter, filterValue);

	return [countriesToAdd, markersToAdd];
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

function addMarkersToMap(markers) {
	$.each(markers, function(index, currentMarker) {
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
function setFilters(jsonFilters, filterType) {

	function setMenu() {
		$.each(jsonFilters, function(index, currentFilter) {
			var filterName = currentFilter.Name;

			var toAppend = '';
			toAppend += '<li>' + filterName + '<ul>';
			// add all the values from the filters
			$.each(currentFilter.Values, function(i, currentValue) {
				toAppend += '<li filter_index=' + index + '>' + currentValue + '</li>';
			});
			toAppend += '</ul></li>';
			$('#jquerymenu').append(toAppend);
		});

		// set the element to behave as a menu
		$("#jquerymenu").menu();

		// triggered when an item is selected
		$("#jquerymenu").on("menuselect", function(event, ui) {
			// selected filter
			var selectedFilter = jsonFilters[ui.item.attr('filter_index')];
			// selected value for the filter
			var filterValue = ui.item.text();
			// apply filtering
			filterFromMenuSelected(selectedFilter, filterValue);
		});
	}

	function setRadioButtons() {
		$.each(jsonFilters, function(index, currentFilter) {
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
		$("#search_button").click(function() {
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

function createFiltersBox(jsonFilters) {

	var selectedMultipleFilters = [];

	// create filters box
	$.each(jsonFilters, function(index, currentFilter) {
		var filterName = currentFilter.Name.toLowerCase();
		filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
		var buttonId = 'dropdown' + index + 'button';
		var ulId = 'dropdown' + index;
		var toAppend = '';

		// filter text
		toAppend += '<p><b>' + filterName + ':</b></p>';
		// dropdown start
		toAppend += '<div class="dropdown">';
		// dropdown button
		toAppend += '<button id=' + buttonId + ' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>';
		// dropdown items
		toAppend += '<ul id=' + ulId + ' class="dropdown-menu">';
		$.each(currentFilter.Values, function(valueIndex, element) {
			toAppend += '<li><a href="#" filterIndex=' + index + ' index=' + valueIndex + '>' + element + ' </a></li>';
		});

		toAppend += '</ul></div>';
		$('#filters_box').prepend(toAppend);

		// add on click listener
		$("#" + ulId + " li a").click(function() {
			var filterIndex = $(this).attr('filterIndex');
			var selectedIndex = $(this).attr('index');
			//console.log('Filter: '+filterIndex+'; Value: '+selectedIndex);
			$("#" + buttonId + ":first-child").text($(this).text());
			$("#" + buttonId + ":first-child").val($(this).text());
			selectedMultipleFilters[filterIndex] = jsonFilters[filterIndex].Values[selectedIndex];
		});

		// add tooltip to the filters box
		$('#filters_box').tooltip({
			title: "Use this filter box to filter by multiple filters",
			placement: "bottom"
		});
	});

	// triggered when the search button is clicked
	$("#filter_box_apply_filters").click(function() {
		if(selectedMultipleFilters.length != 0)
			applyMultipleFilters(selectedMultipleFilters, jsonFilters);
	});

	// triggered when the reset button is clicked
	$("#filter_box_reset_filters").click(function() {

		// re-render dropdowns??

		// set the dropbown button text
		$(".filter-box-dropdown").text("Select a value");
		$(".filter-box-dropdown").val('Select a value');


		// reload the map
		var colors = [];
		$.each(jsonCountries, function(index, currentCountry) {
			colors[currentCountry.Country] = currentCountry.Count;
		});
		reloadMap(colors);

		// add all the markers to the map
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

	});
}

var resetFiltersBox = function() {

	// reset all the 'fboxes'
	for(var i = 0; i < numFilters; i++) {
		$("#fbox" + i).text('');
		$("#fbox" + i).val('');
	}

	// reload the map
	var colors = generateColorsForTheCountries();
	reloadMap(colors);

	// add all the markers to the map
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
};

function createFiltersBoxWithEnumeration(jsonFilters) {

	var numFilters = jsonFilters.length;

	// create filters box with enumeration
	$.each(jsonFilters, function(index, currentFilter) {
		var filterName = currentFilter.Name.toLowerCase();
		filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
		var buttonId = 'dropdown' + index + 'button';
		var ulId = 'dropdown' + index;
		var toAppend = '';

		// filter text
		toAppend += '<p><b>' + filterName + ':</b></p>';
		toAppend += '<div class="form-group">';
		toAppend += '<input type="text" class="form-control" id="fbox' + index + '"';
		// build the placeholder
		var placeholder = currentFilter.Values
		toAppend += 'placeholder="'+ placeholder+'" +>';
		toAppend += '</div>';

		$('#filters_box_enumeration').prepend(toAppend);

		// add Bootstrap tooltip to the filters box
		$('#filters_box_enumeration').tooltip({
			title: "Use this filter box to filter by multiple filters",
			placement: "bottom"
		});
	});

	// triggered when the search button is clicked
	$("#filters_box_enum_apply_filters").click(function() {
		var jsonText = '{';
		for(var i = 0; i < jsonFilters.length; i++) {
			// current and next filter id's
			var currentFilter = "#fbox" + i;
			var nextFilter = "#fbox" + (i + 1);
			// current and next filter values
			var currentFilterValue = $(currentFilter).val();
			var nextFilterValue = $(nextFilter).val();
			// check if we have any filtering to apply or not
			if(currentFilterValue !== '') {
				jsonText += '"' + jsonFilters[i].Name + '": "' + currentFilterValue + '"';
				// if we have one more value and it exists, add a comma
				if(nextFilterValue !== '' && $(nextFilter).length > 0)
					jsonText += ',';
			}
		}
		jsonText += '}';
		var filtersToApply = JSON.parse(jsonText);
		multiFilter(filtersToApply);
	});

	// triggered when the reset button is clicked
	$("#filters_box_enum_reset_filters").click(function() {
		resetFiltersBox();
	});
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

function checkWhatCountriesToAdd(selectedFilter, filterValue) {

	var countries = [];
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
				if(currentCountry[currentValue] == filterValue) {
					countryValueToCheck = currentValue;
					// check by value
					if(currentCountry[currentValue] == filterValue)
						countries[currentCountry.Country] = currentCountry.Count;
				}
			} else
				break;
		} while (true)
	});
	return countries;
};

function checkWhatMarkersToAdd(selectedFilter, filterValue) {
	var markers = [];
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
						markers.push(currentMarker);
				}
			} else {
				break;
			}
		} while (true)
	});

	return markers;
};

function checkWhatCountriesMarkersToAdd(selectedFilter, filterValue) {
	var countriesToAdd = [];
	var markersToAdd = [];

	// check what countries to colour
	countriesToAdd = checkWhatCountriesToAdd(selectedFilter, filterValue);
	markersToAdd = checkWhatMarkersToAdd(selectedFilter, filterValue);

	return [countriesToAdd, markersToAdd];
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

function addMarkersToMap(markers) {
	$.each(markers, function(index, currentMarker) {
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
function generateColorsForTheCountries(a){a||(a=jsonCountries);var b=[];return $.each(a,function(a,c){b[c.Country]=c.Count}),b}function readCountriesFromJSON(a){var b=[];a.length;return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Country(c),b[a].Count>maxCount&&(maxCount=b[a].Count),b[a].Count<minCount&&(minCount=b[a].Count)}),b}function setFilters(a,b){function c(){$.each(a,function(a,b){var c=b.Name,d="";d+="<li>"+c+"<ul>",$.each(b.Values,function(b,c){d+="<li filter_index="+a+">"+c+"</li>"}),d+="</ul></li>",$("#jquerymenu").append(d)}),$("#jquerymenu").menu(),$("#jquerymenu").on("menuselect",function(b,c){var d=a[c.item.attr("filter_index")],e=c.item.text();filterFromMenuSelected(d,e)})}function d(){$.each(a,function(a,b){var c=b.Name,d="";d+='<input type="radio" id="radio'+Number(a+1)+'" name="radio">',d+='<label for = "radio'+Number(a+1)+'">'+c+" </label>",$("#radioButtons").append(d)}),$("#radioButtons").buttonset(),$("#search_button").click(function(){var a=$("#search_text").val();""===a?alert("You must enter a search text"):console.log("searching for "+a)})}switch(b){case"menu":$("#checkboxes_search").hide(),c();break;case"radio":$("#jquerymenu").hide(),d();break;default:console.log("not supported filter")}}function createFiltersBox(a){var b=[];$.each(a,function(c,d){var e=d.Name.toLowerCase();e=e.charAt(0).toUpperCase()+e.slice(1);var f="dropdown"+c+"button",g="dropdown"+c,h="";h+="<p><b>"+e+":</b></p>",h+='<div class="dropdown">',h+="<button id="+f+' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>',h+="<ul id="+g+' class="dropdown-menu">',$.each(d.Values,function(a,b){h+='<li><a href="#" filterIndex='+c+" index="+a+">"+b+" </a></li>"}),h+="</ul></div>",$("#filters_box").prepend(h),$("#"+g+" li a").click(function(){var c=$(this).attr("filterIndex"),d=$(this).attr("index");$("#"+f+":first-child").text($(this).text()),$("#"+f+":first-child").val($(this).text()),b[c]=a[c].Values[d]}),$("#filters_box").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filter_box_apply_filters").click(function(){0!=b.length&&applyMultipleFilters(b,a)}),$("#filter_box_reset_filters").click(function(){$(".filter-box-dropdown").text("Select a value"),$(".filter-box-dropdown").val("Select a value");var a=[];$.each(jsonCountries,function(b,c){a[c.Country]=c.Count}),reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})})}function createFiltersBoxWithEnumeration(a){a.length;$.each(a,function(a,b){var c=b.Name.toLowerCase();c=c.charAt(0).toUpperCase()+c.slice(1);var d="";d+="<p><b>"+c+":</b></p>",d+='<div class="form-group">',d+='<input type="text" class="form-control" id="fbox'+a+'"';var e=b.Values;d+='placeholder="'+e+'" +>',d+="</div>",$("#filters_box_enumeration").prepend(d),$("#filters_box_enumeration").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filters_box_enum_apply_filters").click(function(){for(var b="{",c=0;c<a.length;c++){var d="#fbox"+c,e="#fbox"+(c+1),f=$(d).val(),g=$(e).val();""!==f&&(b+='"'+a[c].Name+'": "'+f+'"',""!==g&&$(e).length>0&&(b+=","))}b+="}";var h=JSON.parse(b);multiFilter(h)}),$("#filters_box_enum_reset_filters").click(function(){resetFiltersBox()})}function getAllFilterValues(a){var b=[];if(-1!=String(a).indexOf(",")){var c=String(a).split(",");$.each(c,function(a,c){if(-1!=c.indexOf("-")){var d=String(c).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(c)})}else if(-1!=a.indexOf("-")){var d=String(a).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(a);return b}function checkWhatCountriesToAdd(a,b){var c=[];return $.each(jsonCountries,function(a,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[g]==b&&(countryValueToCheck=g,d[g]==b&&(c[d.Country]=d.Count))}}),c}function checkWhatMarkersToAdd(a,b){var c=[];return $.each(jsonMarkers,function(d,e){for(var f=0;;){f++;var g="Name"+f,h="Value"+f;if(!e[g])break;e[g]==a.Name&&e[h]==b&&c.push(e)}}),c}function checkWhatCountriesMarkersToAdd(a,b){var c=[],d=[];return c=checkWhatCountriesToAdd(a,b),d=checkWhatMarkersToAdd(a,b),[c,d]}function checkFilterNameIsValid(a){var b=!1;return $.each(jsonFiltersArray,function(c,d){return d.Name.toLowerCase()===a.toLowerCase()?(filterObject=d,void(b=!0)):void 0}),b}function checkFilterValuesAreValid(a,b){var c=!1;return $.each(b,function(a,b){return $.each(filterObject.Values,function(a,d){return d==b?void(c=!0):void 0}),c?void 0:void console.log("Invalid value for the filter: "+b)}),c}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function resetFilters(){var a=generateColorsForTheCountries();reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filterFromMenuSelected(a,b){currentFilter=a;var c=checkWhatCountriesToAdd(a,b);if(reloadMap(c),$.each(jsonMarkers,function(c,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[f]===a.Name&&d[g]===b&&map.addMarker(c,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})}}),isNaN(a.Values[0]))$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide();else{$("#slider").show(),$("#minSlider").show(),$("#maxSlider").show();var d=$("#slider").slider(),e=a.Values[0],f=a.Values[a.Values.length-1];d.slider("option","min",e),d.slider("option","max",f),$("#minSlider").text(e),$("#maxSlider").text(f)}}function sliderChanged(){var a=slider.slider("option","values"),b=a[0],c=a[1],d=currentFilter.Name;$("#minSlider").text(b),$("#maxSlider").text(c);var e=[];$.each(jsonCountries,function(a,d){var f=+d[countryValueToCheck];f>=b&&c>=f&&(e[d.Country]=d.Count)}),reloadMap(e);for(var f,g=jsonCountries[0],h=0;;){h++;var i="Name"+h,j="Value"+h;if(g[i]===d){f=j;break}}$.each(jsonMarkers,function(a,d){d[f]>=b&&d[f]<=c&&map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})})}function readFiltersFromJSON(a){for(var b=[],c=0;c<a.values.length;c++){currentFilter=a.values[c];for(var d=currentFilter.name,e=currentFilter.value,f=[],g=0;g<currentFilter.values.length;g++)f.push(currentFilter.values[g]);b[c]=new Filter(d,e,f)}return numFilters=b.length,b}function jsonMapCountries(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0;c[a]=new Country("",e,f)}),mappingCountries=c,console.log(mappingCountries)})}function jsonMapMarkers(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0,g=d[b.Latitude],h=d[b.Longitude];c[a]=new Marker("",e,f,g,h)}),mappingMarkers=c,console.log(mappingMarkers)})}function buildCountryTooltip(a,b){var c=countryTooltip;return c=c.replace("name",a.html()),c=c.replace("count",b.Count)}function buildMarkerTooltip(a,b){var c=markerTooltip;return c=c.replace("description",a[b].desc),c=c.replace("latitude",a[b].Latitude),c=c.replace("longitude",a[b].Longitude)}function reloadMap(a){$("#"+mDiv).empty(),map=new jvm.Map({map:mType,container:$("#"+mDiv),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:a}]}})}function mapRange(a,b,c,d,e){return d+(e-d)*(a-b)/(c-b)}function readMarkersFromJSON(a){var b=[];return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Marker(c);var d=b[a].Count;d>maxCount&&(maxCount=d),d<minCount&&(minCount=d)}),b}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filter(a){var b=Object.keys(a),c=b.length,d=0,e=new Array,f=new Array;for(i=0;c>i;i++)e[i]=new Array,f[i]=new Array;var g=!1;if($.each(b,function(a,b){return"all"==b.toLowerCase()?(g=!0,resetFilters(),void resetFiltersBox()):void 0}),!g){$.each(b,function(b,c){if(!checkFilterNameIsValid(c))return void console.log("Invalid filter name!("+c+")");var g=a[c],h=getAllFilterValues(g);d++,$.each(h,function(a,c){var d=checkWhatCountriesMarkersToAdd(filterObject,c),g=d[0],h=d[1];$.each(Object.keys(g),function(a,c){var d=g[c];e[b][c]=d}),$.each(h,function(a,c){f[b].push(c)})})});var h=[];if(e.length>0){h=e[0];for(var i=0;i<e.length-1;i++)h=getCountriesIntersection(h,e[i+1])}reloadMap(h);var j=[];if(f.length>0){j=f[0];for(var i=0;i<f.length-1;i++)j=getMarkersIntersection(j,f[i+1])}addMarkersToMap(j)}}function getMarkersIntersection(a,b){var c=[];return $.each(a,function(a,d){var e=d.Country;$.each(b,function(a,b){var f=b.Country;e==f&&c.push(d)})}),c}function getCountriesIntersection(a,b){var c=[];return $.each(Object.keys(a),function(d,e){$.each(Object.keys(b),function(b,d){e==d&&(c[e]=a[e])})}),c}function applyMultipleFiltersProgramattically(a){console.log("Filters to apply: "+a);var b=Object.keys(a),c=b.length,d=[],e=[];$.each(b,function(b,c){a[c]});var f=[];map.removeAllMarkers(),$.each(jsonCountries,function(c,e){d[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!e[h])break;e[h].toLowerCase()==f.toLowerCase()&&e[i]==a[f]&&d[c]++}})}),$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==f.toLowerCase()&&d[i]==a[f]&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function applyMultipleFilters(a,b){var c=a.filter(function(a){return void 0!==a}).length,d=[],e=[];$.each(jsonCountries,function(c,e){d[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(void 0==e[h])break;e[h]===b[a].Name&&e[i]==f&&d[c]++}})});var f=[];$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==b[a].Name.toLowerCase()&&d[i]==f&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}var Country=function(a,b,c){if(""==a)this.Country=b,this.Count=+c,this.Var=0,this.desc="abc";else{var d=!0,e=0;do{e++;var f="Name"+e,g="Value"+e;void 0===a[f]?d=!1:(this[f]=a[f],this[g]=a[g])}while(d);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.desc="abc"}},resetFiltersBox=function(){for(var a=0;numFilters>a;a++)$("#fbox"+a).text(""),$("#fbox"+a).val("");var b=generateColorsForTheCountries();reloadMap(b),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})},Filter=function(a,b,c){this.Name=a,this.Value=b,this.Values=c},numFilters,currentFilter,countryValueToCheck,mappingMarkers=[],mappingCountries=[];VectorialMap.prototype.registerTransformer=function(a,b,c){var b="../mappingJSON/mappingCountriesSample.json",c="../mappingJSON/mappingMarkersSample.json";return b?c?(a="../json/espid-spain.json",void $.getJSON(a,function(a){jsonMapCountries(a,b),jsonMapMarkers(a,c)})):void console.error("you must specify a markers mapping json"):void console.error("you must specify a countries mapping json")};var vectorMap,jsonFilters=[],minColorMap,maxColorMap,mDiv,mType,VectorialMap=function(){};VectorialMap.prototype.createMap=function(a,b,c,d,e,f,g){mType=g,jsonCountries=[],jsonMarkers=[],mDiv=d,minColorMap=e,maxColorMap=f,jsonCountries=readCountriesFromJSON(a.countries),a.markers?(jsonMarkers=readMarkersFromJSON(a.markers),numMarkers=jsonMarkers.length):console.log("There are no markers as input");var h=generateColorsForTheCountries();jQuery.ajax({url:"../tooltip-templates/country_tooltip.html",success:function(a){countryTooltip=a},async:!1}),jQuery.ajax({url:"../tooltip-templates/marker_tooltip.html",success:function(a){markerTooltip=a},async:!1}),map=new jvm.Map({map:mType,container:$("#"+d),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:h}]}}),a.markers&&$.each(jsonMarkers,function(a,d){map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,b,c)}})}),this.createSlider()},VectorialMap.prototype.createSlider=function(){slider=$("#slider").slider(),slider.slider("option","min",minRadius),slider.slider("option","max",maxRadius),slider.slider("option","range",!0),slider.slider("option","animate","slow"),slider.on("slidechange",function(a,b){sliderChanged()}),$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide()},VectorialMap.prototype.filterOnServer=function(a){$.getJSON("../json/serverFilter.json",function(a){var b=JSON.stringify(a),c="http://serverFiltering.com/?data="+encodeURIComponent(b);c="../json/countries_plus_markers2.json",$.getJSON(c,function(a){jsonCountries=readCountriesFromJSON(a.countries);var b=generateColorsForTheCountries(jsonCountries);reloadMap(b),a.markers&&(jsonMarkers=readMarkersFromJSON(a.markers),addMarkersToMap(jsonMarkers))})})};var Marker=function(a,b,c,d,e){if(""==a)this.Country=b,this.Count=+c,this.Var="",this.Latitude=d,this.Longitude=e,this.desc="abc";else{var f=!0,g=0;do{g++;var h="Name"+g,i="Value"+g;a[h]?(this[h]=a[h],this[i]=a[i]):f=!1}while(f);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.Latitude=a.Latitude,this.Longitude=a.Longitude,this.desc="abc"}};var mappingMarkers = [];
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
			var name = currentJSON[jsonMapping.Country];
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
			var name = currentJSON[jsonMapping.Country];
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
var vectorMap;
var jsonFilters = [];
var minColorMap;
var maxColorMap;
var mDiv;
var mType;

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputJSON, minRadius, maxRadius, mapDiv, minColor, maxColor, mapType) {
	mType = mapType;
	// countries list
	jsonCountries = [];
	// markers list
	jsonMarkers = [];
	// id of the map
	mDiv = mapDiv;
	// assign the colors for the range
	minColorMap = minColor;
	maxColorMap = maxColor;

	// read markers and jsonFilters from JSON file
	// try to read the countries
	jsonCountries = readCountriesFromJSON(inputJSON.countries);
	// try to read the markers - markers aren't mandatory
	if(!inputJSON.markers)
		console.log('There are no markers as input');
	else {
		jsonMarkers = readMarkersFromJSON(inputJSON.markers);
		numMarkers = jsonMarkers.length;
	}

	// get the Count value for each Country
	var auxColors = generateColorsForTheCountries();

	// get the tooltip templates
	// COUNTRY tooltip
	jQuery.ajax({
		url: '../tooltip-templates/country_tooltip.html',
		success: function(result) {
			countryTooltip = result;
		},
		async: false
	});

	// MARKER tooltip
	jQuery.ajax({
		url: '../tooltip-templates/marker_tooltip.html',
		success: function(result) {
			markerTooltip = result;
		},
		async: false
	});



	// add the map to the div (no markers are initially specified)
	map = new jvm.Map({
		// type of map (world, Europe, USA, etc)
		map: mType,
		// id of its container
		container: $('#' + mapDiv),
		// triggered when a marker is hovered
		onMarkerTipShow: function(e, label, index) {
			// select what text to display when marker is hovered
			var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
			label.html(finalTooltip);
		},
		// triggered when a region is hovered
		onRegionTipShow: function(e, countryName, code) {
			// code contains the code of the country (i.e., PT, ES, FR, etc)
			// show the Count associated to that Country - look for the country
			var selectedCountry = -1;
			$.each(jsonCountries, function(index, currentCountry) {
				if(currentCountry.Country === code) {
					selectedCountry = currentCountry;
					return;
				}
			});
			if(selectedCountry != -1) {
				// find occurrence of several strings inside the template
				var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
				countryName.html(finalTooltip);
			} else
				countryName.html(countryName.html());
		},
		series: {
			markers: [{
				// range of values associated with the Count
				scale: [minColorMap, maxColorMap],
				values: [minCount, maxCount],
				// add a legend
				legend: {
					vertical: true
				}
			}],
			regions: [{
				// min and max values of count
				scale: [minColorMap, maxColorMap],
				attribute: 'fill',
				values: auxColors
			}]
		}
	});

	// draw markers on the map
	if(inputJSON.markers) {
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

	// generate the slider and set corresponding values and callbacks
	this.createSlider();
};

function buildCountryTooltip(countryName, selectedCountry)
{
	var finalTooltip = countryTooltip;
	finalTooltip = finalTooltip.replace('name', countryName.html());
	finalTooltip = finalTooltip.replace('count', selectedCountry.Count);
	return finalTooltip;
}

function buildMarkerTooltip(jsonMarkers, index)
{
	var finalTooltip = markerTooltip;
	finalTooltip = finalTooltip.replace('description', jsonMarkers[index].desc);
	finalTooltip = finalTooltip.replace('latitude', jsonMarkers[index].Latitude);
	finalTooltip = finalTooltip.replace('longitude', jsonMarkers[index].Longitude);
	return finalTooltip;
}

// redraw the map
function reloadMap(colors) {
	// erase the map
	$("#" + mDiv).empty();

	map = new jvm.Map({
		map: mType,
		container: $('#' + mDiv),
		onMarkerTipShow: function(e, label, index) {
			var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
			label.html(finalTooltip);
		},
		onRegionTipShow: function(e, countryName, code) {
			// code contains the code of the country (i.e., PT, ES, FR, etc)
			// show the Count associated to that Country - look for the country
			var selectedCountry = -1;
			$.each(jsonCountries, function(index, currentCountry) {
				if(currentCountry.Country === code) {
					selectedCountry = currentCountry;
					return;
				}
			});
			if(selectedCountry != -1)
			{
				var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
				countryName.html(finalTooltip);
			}
			else
				countryName.html(countryName.html());
		},
		series: {
			markers: [{
				scale: [minColorMap, maxColorMap],
				values: [minCount, maxCount],
				legend: {
					vertical: true
				}
			}],
			regions: [{
				// min and max values of count
				scale: [minColorMap, maxColorMap],
				attribute: 'fill',
				// the colors are 'stretched' to fill the scale
				values: colors
			}]
		}
	});
}

// Auxiliary function to transpose a value from an initial range to another range
function mapRange(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

VectorialMap.prototype.createSlider = function() {

	// jQueryUI slider
	slider = $("#slider").slider();

	// set max and min value for the slider
	slider.slider("option", "min", minRadius);
	slider.slider("option", "max", maxRadius);

	// allow the user to select a range
	slider.slider("option", "range", true);

	// when user clicks the slider, it will animate to the clicked position
	slider.slider("option", "animate", "slow");

	// after selecting a new slider value
	slider.on("slidechange", function(event, ui) {
		sliderChanged();
	});

	// hide all the components until they are hidden
	$('#slider').hide();
	$('#minSlider').hide();
	$('#maxSlider').hide();
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
			if(json.markers) {
				// read the markers from the JSON file
				jsonMarkers = readMarkersFromJSON(json.markers);
				// add markers to the map
				addMarkersToMap(jsonMarkers);
			}
		});
	});
}
// Marker definition
var Marker = function (markerObject,name, count, latitude, longitude) {
	if(markerObject == '')
	{
		this.Country = name;
		this.Count = +count;
		this.Var = '';
		this.Latitude = latitude;
		this.Longitude = longitude;
		// TODO - add escription to a Marker from the JSON file
		this.desc = 'abc';
	}
	else {
		// try to read all the names and values
		var hasName = true;
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			if(!markerObject[currentNameToCheck]) {
				hasName = false;
			} else {
				this[currentNameToCheck] = markerObject[currentNameToCheck];
				this[currentValue] = markerObject[currentValue];
			}
		} while (hasName)

		this.Country = markerObject.Country;
		this.Count = +markerObject.Count;
		this.Var = markerObject.Var;
		this.Latitude = markerObject.Latitude;
		this.Longitude = markerObject.Longitude;
		// TODO - add escription to a Marker from the JSON file
		this.desc = 'abc';
	}
};

// read the markers from a JSON file
function readMarkersFromJSON(jsonMarkers) {
	var markers = [];

	minCount = Infinity;
	maxCount = -Infinity;

	$.each(jsonMarkers, function (index, currentJSONMarker) {
		markers[index] = new Marker(currentJSONMarker);
		var currentCountValue = markers[index].Count;

		if(currentCountValue > maxCount) {
			maxCount = currentCountValue;
		}
		if(currentCountValue < minCount)
			minCount = currentCountValue;
	});
	return markers;
}


function addMarkersToMap(markers) {
	$.each(markers, function (index, currentMarker) {
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
function filter(inputArgs) {

	var keys = Object.keys(inputArgs)
	var numberKeys = keys.length;
	var validFilters = 0;

	var countriesByFilter = new Array();
	var markersByFilter = new Array();
	for(i = 0; i < numberKeys; i++) {
		countriesByFilter[i] = new Array();
		markersByFilter[i] = new Array();
	}

	// check if any of the names is all (reset all applied filters	)
	var exit = false;
	$.each(keys, function(index, filterName) {
		if(filterName.toLowerCase() == 'all') {
			exit = true;
			// reloads the original markers and countries on the map
			resetFilters();
			// erase the text from the filters box
			resetFiltersBox();
			return;
		}
	});
	if(exit)
		return;

	// for every key/filter
	$.each(keys, function(index, filterName) {
		// check if the filterName is valid
		if(!checkFilterNameIsValid(filterName)) {
			// invalid filter name
			console.log('Invalid filter name!(' + filterName + ')');
			return;

		} else {
			// get the filter value (can contain enumeration and range)
			// '2004-2006' , 'F,M', etc
			var filterValue = inputArgs[filterName];
			// get all single filter values
			var finalParts = getAllFilterValues(filterValue);
			//console.log(finalParts);
			validFilters++;

			// for every single value get all the countrues and markers
			$.each(finalParts, function(i, part) {
				var checkReturn = checkWhatCountriesMarkersToAdd(filterObject, part);
				var countriesAux = checkReturn[0];
				var markersAux = checkReturn[1];
				// add every country to the list of countriesByFilter
				// add every marker to the list of markersByFilter
				$.each(Object.keys(countriesAux), function(j, currentKey) {
					// the colors that are returned are in a json format
					var keyValue = countriesAux[currentKey];
					countriesByFilter[index][currentKey] = keyValue;
				});
				// get the markers
				$.each(markersAux, function(j, currentMarker) {
					markersByFilter[index].push(currentMarker);
				});
			});
		}
	});

	// get the final countries
	var finalCountries = [];
	if(countriesByFilter.length > 0) {
		finalCountries = countriesByFilter[0];
		for(var i = 0; i < countriesByFilter.length - 1; i++)
			finalCountries = getCountriesIntersection(finalCountries, countriesByFilter[i + 1]);
	}

	// add countries to Map
	reloadMap(finalCountries);


	// get the final markers
	var finalMarkers = [];
	if(markersByFilter.length > 0) {
		finalMarkers = markersByFilter[0];
		for(var i = 0; i < markersByFilter.length - 1; i++) {
			finalMarkers = getMarkersIntersection(finalMarkers, markersByFilter[i + 1]);
		}
	}

	// add markers to the map
	addMarkersToMap(finalMarkers);

}

function getMarkersIntersection(markersGroup1, markersGroup2) {
	var markers = [];

	// markers that belong to the two groups
	$.each(markersGroup1, function(index, marker1) {
		// check if this marker name is inside the second group
		var marker1Country = marker1.Country;
		$.each(markersGroup2, function(index, marker2) {
			var marker2Country = marker2.Country;
			if(marker1Country == marker2Country)
				markers.push(marker1)
		});
	});

	return markers;
}

function getCountriesIntersection(countriesGroup1, countriesGroup2) {
	// countries that belong to the two groups
	var countries = [];

	$.each(Object.keys(countriesGroup1), function(index, countryName1) {
		// check if this country name is inside the second group
		$.each(Object.keys(countriesGroup2), function(index, countryName2) {
			if(countryName1 == countryName2)
				countries[countryName1] = countriesGroup1[countryName1];
		});
	});
	return countries;
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
		if(countriesHaveFilter[countryIndex] == numFiltersToApply)
			colors[currentCountry.Country] = currentCountry.Count;
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
function generateColorsForTheCountries(a){a||(a=jsonCountries);var b=[];return $.each(a,function(a,c){b[c.Country]=c.Count}),b}function readCountriesFromJSON(a){var b=[];a.length;return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Country(c),b[a].Count>maxCount&&(maxCount=b[a].Count),b[a].Count<minCount&&(minCount=b[a].Count)}),b}function setFilters(a,b){function c(){$.each(a,function(a,b){var c=b.Name,d="";d+="<li>"+c+"<ul>",$.each(b.Values,function(b,c){d+="<li filter_index="+a+">"+c+"</li>"}),d+="</ul></li>",$("#jquerymenu").append(d)}),$("#jquerymenu").menu(),$("#jquerymenu").on("menuselect",function(b,c){var d=a[c.item.attr("filter_index")],e=c.item.text();filterFromMenuSelected(d,e)})}function d(){$.each(a,function(a,b){var c=b.Name,d="";d+='<input type="radio" id="radio'+Number(a+1)+'" name="radio">',d+='<label for = "radio'+Number(a+1)+'">'+c+" </label>",$("#radioButtons").append(d)}),$("#radioButtons").buttonset(),$("#search_button").click(function(){var a=$("#search_text").val();""===a?alert("You must enter a search text"):console.log("searching for "+a)})}switch(b){case"menu":$("#checkboxes_search").hide(),c();break;case"radio":$("#jquerymenu").hide(),d();break;default:console.log("not supported filter")}}function createFiltersBox(a){var b=[];$.each(a,function(c,d){var e=d.Name.toLowerCase();e=e.charAt(0).toUpperCase()+e.slice(1);var f="dropdown"+c+"button",g="dropdown"+c,h="";h+="<p><b>"+e+":</b></p>",h+='<div class="dropdown">',h+="<button id="+f+' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>',h+="<ul id="+g+' class="dropdown-menu">',$.each(d.Values,function(a,b){h+='<li><a href="#" filterIndex='+c+" index="+a+">"+b+" </a></li>"}),h+="</ul></div>",$("#filters_box").prepend(h),$("#"+g+" li a").click(function(){var c=$(this).attr("filterIndex"),d=$(this).attr("index");$("#"+f+":first-child").text($(this).text()),$("#"+f+":first-child").val($(this).text()),b[c]=a[c].Values[d]}),$("#filters_box").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filter_box_apply_filters").click(function(){0!=b.length&&applyMultipleFilters(b,a)}),$("#filter_box_reset_filters").click(function(){$(".filter-box-dropdown").text("Select a value"),$(".filter-box-dropdown").val("Select a value");var a=[];$.each(jsonCountries,function(b,c){a[c.Country]=c.Count}),reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})})}function createFiltersBoxWithEnumeration(a){a.length;$.each(a,function(a,b){var c=b.Name.toLowerCase();c=c.charAt(0).toUpperCase()+c.slice(1);var d="";d+="<p><b>"+c+":</b></p>",d+='<div class="form-group">',d+='<input type="text" class="form-control" id="fbox'+a+'"';var e=b.Values;d+='placeholder="'+e+'" +>',d+="</div>",$("#filters_box_enumeration").prepend(d),$("#filters_box_enumeration").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filters_box_enum_apply_filters").click(function(){for(var b="{",c=0;c<a.length;c++){var d="#fbox"+c,e="#fbox"+(c+1),f=$(d).val(),g=$(e).val();""!==f&&(b+='"'+a[c].Name+'": "'+f+'"',""!==g&&$(e).length>0&&(b+=","))}b+="}";var h=JSON.parse(b);multiFilter(h)}),$("#filters_box_enum_reset_filters").click(function(){resetFiltersBox()})}function getAllFilterValues(a){var b=[];if(-1!=String(a).indexOf(",")){var c=String(a).split(",");$.each(c,function(a,c){if(-1!=c.indexOf("-")){var d=String(c).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(c)})}else if(-1!=a.indexOf("-")){var d=String(a).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(a);return b}function checkWhatCountriesToAdd(a,b){var c=[];return $.each(jsonCountries,function(a,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[g]==b&&(countryValueToCheck=g,d[g]==b&&(c[d.Country]=d.Count))}}),c}function checkWhatMarkersToAdd(a,b){var c=[];return $.each(jsonMarkers,function(d,e){for(var f=0;;){f++;var g="Name"+f,h="Value"+f;if(!e[g])break;e[g]==a.Name&&e[h]==b&&c.push(e)}}),c}function checkWhatCountriesMarkersToAdd(a,b){var c=[],d=[];return c=checkWhatCountriesToAdd(a,b),d=checkWhatMarkersToAdd(a,b),[c,d]}function checkFilterNameIsValid(a){var b=!1;return $.each(jsonFiltersArray,function(c,d){return d.Name.toLowerCase()===a.toLowerCase()?(filterObject=d,void(b=!0)):void 0}),b}function checkFilterValuesAreValid(a,b){var c=!1;return $.each(b,function(a,b){return $.each(filterObject.Values,function(a,d){return d==b?void(c=!0):void 0}),c?void 0:void console.log("Invalid value for the filter: "+b)}),c}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function resetFilters(){var a=generateColorsForTheCountries();reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filterFromMenuSelected(a,b){currentFilter=a;var c=checkWhatCountriesToAdd(a,b);if(reloadMap(c),$.each(jsonMarkers,function(c,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[f]===a.Name&&d[g]===b&&map.addMarker(c,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})}}),isNaN(a.Values[0]))$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide();else{$("#slider").show(),$("#minSlider").show(),$("#maxSlider").show();var d=$("#slider").slider(),e=a.Values[0],f=a.Values[a.Values.length-1];d.slider("option","min",e),d.slider("option","max",f),$("#minSlider").text(e),$("#maxSlider").text(f)}}function sliderChanged(){var a=slider.slider("option","values"),b=a[0],c=a[1],d=currentFilter.Name;$("#minSlider").text(b),$("#maxSlider").text(c);var e=[];$.each(jsonCountries,function(a,d){var f=+d[countryValueToCheck];f>=b&&c>=f&&(e[d.Country]=d.Count)}),reloadMap(e);for(var f,g=jsonCountries[0],h=0;;){h++;var i="Name"+h,j="Value"+h;if(g[i]===d){f=j;break}}$.each(jsonMarkers,function(a,d){d[f]>=b&&d[f]<=c&&map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})})}function readFiltersFromJSON(a){for(var b=[],c=0;c<a.values.length;c++){currentFilter=a.values[c];for(var d=currentFilter.name,e=currentFilter.value,f=[],g=0;g<currentFilter.values.length;g++)f.push(currentFilter.values[g]);b[c]=new Filter(d,e,f)}return numFilters=b.length,b}function generateColorsForTheCountries(a){a||(a=jsonCountries);var b=[];return $.each(a,function(a,c){b[c.Country]=c.Count}),b}function readCountriesFromJSON(a){var b=[];a.length;return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Country(c),b[a].Count>maxCount&&(maxCount=b[a].Count),b[a].Count<minCount&&(minCount=b[a].Count)}),b}function setFilters(a,b){function c(){$.each(a,function(a,b){var c=b.Name,d="";d+="<li>"+c+"<ul>",$.each(b.Values,function(b,c){d+="<li filter_index="+a+">"+c+"</li>"}),d+="</ul></li>",$("#jquerymenu").append(d)}),$("#jquerymenu").menu(),$("#jquerymenu").on("menuselect",function(b,c){var d=a[c.item.attr("filter_index")],e=c.item.text();filterFromMenuSelected(d,e)})}function d(){$.each(a,function(a,b){var c=b.Name,d="";d+='<input type="radio" id="radio'+Number(a+1)+'" name="radio">',d+='<label for = "radio'+Number(a+1)+'">'+c+" </label>",$("#radioButtons").append(d)}),$("#radioButtons").buttonset(),$("#search_button").click(function(){var a=$("#search_text").val();""===a?alert("You must enter a search text"):console.log("searching for "+a)})}switch(b){case"menu":$("#checkboxes_search").hide(),c();break;case"radio":$("#jquerymenu").hide(),d();break;default:console.log("not supported filter")}}function createFiltersBox(a){var b=[];$.each(a,function(c,d){var e=d.Name.toLowerCase();e=e.charAt(0).toUpperCase()+e.slice(1);var f="dropdown"+c+"button",g="dropdown"+c,h="";h+="<p><b>"+e+":</b></p>",h+='<div class="dropdown">',h+="<button id="+f+' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>',h+="<ul id="+g+' class="dropdown-menu">',$.each(d.Values,function(a,b){h+='<li><a href="#" filterIndex='+c+" index="+a+">"+b+" </a></li>"}),h+="</ul></div>",$("#filters_box").prepend(h),$("#"+g+" li a").click(function(){var c=$(this).attr("filterIndex"),d=$(this).attr("index");$("#"+f+":first-child").text($(this).text()),$("#"+f+":first-child").val($(this).text()),b[c]=a[c].Values[d]}),$("#filters_box").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filter_box_apply_filters").click(function(){0!=b.length&&applyMultipleFilters(b,a)}),$("#filter_box_reset_filters").click(function(){$(".filter-box-dropdown").text("Select a value"),$(".filter-box-dropdown").val("Select a value");var a=[];$.each(jsonCountries,function(b,c){a[c.Country]=c.Count}),reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})})}function createFiltersBoxWithEnumeration(a){a.length;$.each(a,function(a,b){var c=b.Name.toLowerCase();c=c.charAt(0).toUpperCase()+c.slice(1);var d="";d+="<p><b>"+c+":</b></p>",d+='<div class="form-group">',d+='<input type="text" class="form-control" id="fbox'+a+'"';var e=b.Values;d+='placeholder="'+e+'" +>',d+="</div>",$("#filters_box_enumeration").prepend(d),$("#filters_box_enumeration").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filters_box_enum_apply_filters").click(function(){for(var b="{",c=0;c<a.length;c++){var d="#fbox"+c,e="#fbox"+(c+1),f=$(d).val(),g=$(e).val();""!==f&&(b+='"'+a[c].Name+'": "'+f+'"',""!==g&&$(e).length>0&&(b+=","))}b+="}";var h=JSON.parse(b);multiFilter(h)}),$("#filters_box_enum_reset_filters").click(function(){resetFiltersBox()})}function getAllFilterValues(a){var b=[];if(-1!=String(a).indexOf(",")){var c=String(a).split(",");$.each(c,function(a,c){if(-1!=c.indexOf("-")){var d=String(c).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(c)})}else if(-1!=a.indexOf("-")){var d=String(a).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(a);return b}function checkWhatCountriesToAdd(a,b){var c=[];return $.each(jsonCountries,function(a,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[g]==b&&(countryValueToCheck=g,d[g]==b&&(c[d.Country]=d.Count))}}),c}function checkWhatMarkersToAdd(a,b){var c=[];return $.each(jsonMarkers,function(d,e){for(var f=0;;){f++;var g="Name"+f,h="Value"+f;if(!e[g])break;e[g]==a.Name&&e[h]==b&&c.push(e)}}),c}function checkWhatCountriesMarkersToAdd(a,b){var c=[],d=[];return c=checkWhatCountriesToAdd(a,b),d=checkWhatMarkersToAdd(a,b),[c,d]}function checkFilterNameIsValid(a){var b=!1;return $.each(jsonFiltersArray,function(c,d){return d.Name.toLowerCase()===a.toLowerCase()?(filterObject=d,void(b=!0)):void 0}),b}function checkFilterValuesAreValid(a,b){var c=!1;return $.each(b,function(a,b){return $.each(filterObject.Values,function(a,d){return d==b?void(c=!0):void 0}),c?void 0:void console.log("Invalid value for the filter: "+b)}),c}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function resetFilters(){var a=generateColorsForTheCountries();reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filterFromMenuSelected(a,b){currentFilter=a;var c=checkWhatCountriesToAdd(a,b);if(reloadMap(c),$.each(jsonMarkers,function(c,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[f]===a.Name&&d[g]===b&&map.addMarker(c,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})}}),isNaN(a.Values[0]))$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide();else{$("#slider").show(),$("#minSlider").show(),$("#maxSlider").show();var d=$("#slider").slider(),e=a.Values[0],f=a.Values[a.Values.length-1];d.slider("option","min",e),d.slider("option","max",f),$("#minSlider").text(e),$("#maxSlider").text(f)}}function sliderChanged(){var a=slider.slider("option","values"),b=a[0],c=a[1],d=currentFilter.Name;$("#minSlider").text(b),$("#maxSlider").text(c);var e=[];$.each(jsonCountries,function(a,d){var f=+d[countryValueToCheck];f>=b&&c>=f&&(e[d.Country]=d.Count)}),reloadMap(e);for(var f,g=jsonCountries[0],h=0;;){h++;var i="Name"+h,j="Value"+h;if(g[i]===d){f=j;break}}$.each(jsonMarkers,function(a,d){d[f]>=b&&d[f]<=c&&map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})})}function readFiltersFromJSON(a){for(var b=[],c=0;c<a.values.length;c++){currentFilter=a.values[c];for(var d=currentFilter.name,e=currentFilter.value,f=[],g=0;g<currentFilter.values.length;g++)f.push(currentFilter.values[g]);b[c]=new Filter(d,e,f)}return numFilters=b.length,b}function generateColorsForTheCountries(a){a||(a=jsonCountries);var b=[];return $.each(a,function(a,c){b[c.Country]=c.Count}),b}function readCountriesFromJSON(a){var b=[];return a.length,minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Country(c),b[a].Count>maxCount&&(maxCount=b[a].Count),b[a].Count<minCount&&(minCount=b[a].Count)}),b}function setFilters(a,b){function c(){$.each(a,function(a,b){var c=b.Name,d="";d+="<li>"+c+"<ul>",$.each(b.Values,function(b,c){d+="<li filter_index="+a+">"+c+"</li>"}),d+="</ul></li>",$("#jquerymenu").append(d)}),$("#jquerymenu").menu(),$("#jquerymenu").on("menuselect",function(b,c){var d=a[c.item.attr("filter_index")],e=c.item.text();filterFromMenuSelected(d,e)})}function d(){$.each(a,function(a,b){var c=b.Name,d="";d+='<input type="radio" id="radio'+Number(a+1)+'" name="radio">',d+='<label for = "radio'+Number(a+1)+'">'+c+" </label>",$("#radioButtons").append(d)}),$("#radioButtons").buttonset(),$("#search_button").click(function(){var a=$("#search_text").val();""===a?alert("You must enter a search text"):console.log("searching for "+a)})}switch(b){case"menu":$("#checkboxes_search").hide(),c();break;case"radio":$("#jquerymenu").hide(),d();break;default:console.log("not supported filter")}}function createFiltersBox(a){var b=[];$.each(a,function(c,d){var e=d.Name.toLowerCase();e=e.charAt(0).toUpperCase()+e.slice(1);var f="dropdown"+c+"button",g="dropdown"+c,h="";h+="<p><b>"+e+":</b></p>",h+='<div class="dropdown">',h+="<button id="+f+' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>',h+="<ul id="+g+' class="dropdown-menu">',$.each(d.Values,function(a,b){h+='<li><a href="#" filterIndex='+c+" index="+a+">"+b+" </a></li>"}),h+="</ul></div>",$("#filters_box").prepend(h),$("#"+g+" li a").click(function(){var c=$(this).attr("filterIndex"),d=$(this).attr("index");$("#"+f+":first-child").text($(this).text()),$("#"+f+":first-child").val($(this).text()),b[c]=a[c].Values[d]}),$("#filters_box").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filter_box_apply_filters").click(function(){0!=b.length&&applyMultipleFilters(b,a)}),$("#filter_box_reset_filters").click(function(){$(".filter-box-dropdown").text("Select a value"),$(".filter-box-dropdown").val("Select a value");var a=[];$.each(jsonCountries,function(b,c){a[c.Country]=c.Count}),reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})})}function createFiltersBoxWithEnumeration(a){a.length,$.each(a,function(a,b){var c=b.Name.toLowerCase();c=c.charAt(0).toUpperCase()+c.slice(1);var d="";d+="<p><b>"+c+":</b></p>",d+='<div class="form-group">',d+='<input type="text" class="form-control" id="fbox'+a+'"';var e=b.Values;d+='placeholder="'+e+'" +>',d+="</div>",$("#filters_box_enumeration").prepend(d),$("#filters_box_enumeration").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filters_box_enum_apply_filters").click(function(){for(var b="{",c=0;c<a.length;c++){var d="#fbox"+c,e="#fbox"+(c+1),f=$(d).val(),g=$(e).val();""!==f&&(b+='"'+a[c].Name+'": "'+f+'"',""!==g&&$(e).length>0&&(b+=","))}b+="}";var h=JSON.parse(b);multiFilter(h)}),$("#filters_box_enum_reset_filters").click(function(){resetFiltersBox()})}function getAllFilterValues(a){var b=[];if(-1!=String(a).indexOf(",")){var c=String(a).split(",");$.each(c,function(a,c){if(-1!=c.indexOf("-")){var d=String(c).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(c)})}else if(-1!=a.indexOf("-")){var d=String(a).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(a);return b}function checkWhatCountriesToAdd(a,b){var c=[];return $.each(jsonCountries,function(a,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[g]==b&&(countryValueToCheck=g,d[g]==b&&(c[d.Country]=d.Count))}}),c}function checkWhatMarkersToAdd(a,b){var c=[];return $.each(jsonMarkers,function(d,e){for(var f=0;;){f++;var g="Name"+f,h="Value"+f;if(!e[g])break;e[g]==a.Name&&e[h]==b&&c.push(e)}}),c}function checkWhatCountriesMarkersToAdd(a,b){var c=[],d=[];return c=checkWhatCountriesToAdd(a,b),d=checkWhatMarkersToAdd(a,b),[c,d]}function checkFilterNameIsValid(a){var b=!1;return $.each(jsonFiltersArray,function(c,d){return d.Name.toLowerCase()===a.toLowerCase()?(filterObject=d,void(b=!0)):void 0}),b}function checkFilterValuesAreValid(a,b){var c=!1;return $.each(b,function(a,b){return $.each(filterObject.Values,function(a,d){return d==b?void(c=!0):void 0}),c?void 0:void console.log("Invalid value for the filter: "+b)}),c}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function resetFilters(){var a=generateColorsForTheCountries();reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filterFromMenuSelected(a,b){currentFilter=a;var c=checkWhatCountriesToAdd(a,b);if(reloadMap(c),$.each(jsonMarkers,function(c,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[f]===a.Name&&d[g]===b&&map.addMarker(c,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})}}),isNaN(a.Values[0]))$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide();else{$("#slider").show(),$("#minSlider").show(),$("#maxSlider").show();var d=$("#slider").slider(),e=a.Values[0],f=a.Values[a.Values.length-1];d.slider("option","min",e),d.slider("option","max",f),$("#minSlider").text(e),$("#maxSlider").text(f)}}function sliderChanged(){var a=slider.slider("option","values"),b=a[0],c=a[1],d=currentFilter.Name;$("#minSlider").text(b),$("#maxSlider").text(c);var e=[];$.each(jsonCountries,function(a,d){var f=+d[countryValueToCheck];f>=b&&c>=f&&(e[d.Country]=d.Count)}),reloadMap(e);for(var f,g=jsonCountries[0],h=0;;){h++;var i="Name"+h,j="Value"+h;if(g[i]===d){f=j;break}}$.each(jsonMarkers,function(a,d){d[f]>=b&&d[f]<=c&&map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})})}function readFiltersFromJSON(a){for(var b=[],c=0;c<a.values.length;c++){currentFilter=a.values[c];for(var d=currentFilter.name,e=currentFilter.value,f=[],g=0;g<currentFilter.values.length;g++)f.push(currentFilter.values[g]);b[c]=new Filter(d,e,f)}return numFilters=b.length,b}function jsonMapCountries(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0;c[a]=new Country("",e,f)}),mappingCountries=c,console.log(mappingCountries)})}function jsonMapMarkers(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0,g=d[b.Latitude],h=d[b.Longitude];c[a]=new Marker("",e,f,g,h)}),mappingMarkers=c,console.log(mappingMarkers)})}function buildCountryTooltip(a,b){var c=countryTooltip;return c=c.replace("name",a.html()),c=c.replace("count",b.Count)}function buildMarkerTooltip(a,b){var c=markerTooltip;return c=c.replace("description",a[b].desc),c=c.replace("latitude",a[b].Latitude),c=c.replace("longitude",a[b].Longitude)}function reloadMap(a){$("#"+mDiv).empty(),map=new jvm.Map({map:mType,container:$("#"+mDiv),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:a}]}})}function mapRange(a,b,c,d,e){return d+(e-d)*(a-b)/(c-b)}function readMarkersFromJSON(a){var b=[];return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Marker(c);var d=b[a].Count;d>maxCount&&(maxCount=d),d<minCount&&(minCount=d)}),b}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filter(a){var b=Object.keys(a),c=b.length,d=0,e=new Array,f=new Array;for(i=0;c>i;i++)e[i]=new Array,f[i]=new Array;var g=!1;if($.each(b,function(a,b){return"all"==b.toLowerCase()?(g=!0,resetFilters(),void resetFiltersBox()):void 0}),!g){$.each(b,function(b,c){if(!checkFilterNameIsValid(c))return void console.log("Invalid filter name!("+c+")");var g=a[c],h=getAllFilterValues(g);d++,$.each(h,function(a,c){var d=checkWhatCountriesMarkersToAdd(filterObject,c),g=d[0],h=d[1];$.each(Object.keys(g),function(a,c){var d=g[c];e[b][c]=d}),$.each(h,function(a,c){f[b].push(c)})})});var h=[];if(e.length>0){h=e[0];for(var i=0;i<e.length-1;i++)h=getCountriesIntersection(h,e[i+1])}reloadMap(h);var j=[];if(f.length>0){j=f[0];for(var i=0;i<f.length-1;i++)j=getMarkersIntersection(j,f[i+1])}addMarkersToMap(j)}}function getMarkersIntersection(a,b){var c=[];return $.each(a,function(a,d){var e=d.Country;$.each(b,function(a,b){var f=b.Country;e==f&&c.push(d)})}),c}function getCountriesIntersection(a,b){var c=[];return $.each(Object.keys(a),function(d,e){$.each(Object.keys(b),function(b,d){e==d&&(c[e]=a[e])})}),c}function applyMultipleFiltersProgramattically(a){console.log("Filters to apply: "+a);var b=Object.keys(a),c=b.length,d=[],e=[];$.each(b,function(b,c){a[c]});var f=[];map.removeAllMarkers(),$.each(jsonCountries,function(c,e){d[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!e[h])break;e[h].toLowerCase()==f.toLowerCase()&&e[i]==a[f]&&d[c]++}})}),$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==f.toLowerCase()&&d[i]==a[f]&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function applyMultipleFilters(a,b){var c=a.filter(function(a){return void 0!==a}).length,d=[],e=[];$.each(jsonCountries,function(c,e){d[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(void 0==e[h])break;e[h]===b[a].Name&&e[i]==f&&d[c]++}})});var f=[];$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==b[a].Name.toLowerCase()&&d[i]==f&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function jsonMapCountries(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0;c[a]=new Country("",e,f)}),mappingCountries=c,console.log(mappingCountries)})}function jsonMapMarkers(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0,g=d[b.Latitude],h=d[b.Longitude];c[a]=new Marker("",e,f,g,h)}),mappingMarkers=c,console.log(mappingMarkers)})}function buildCountryTooltip(a,b){var c=countryTooltip;return c=c.replace("name",a.html()),c=c.replace("count",b.Count)}function buildMarkerTooltip(a,b){var c=markerTooltip;return c=c.replace("description",a[b].desc),c=c.replace("latitude",a[b].Latitude),c=c.replace("longitude",a[b].Longitude)}function reloadMap(a){$("#"+mDiv).empty(),map=new jvm.Map({map:mType,container:$("#"+mDiv),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:a}]}})}function mapRange(a,b,c,d,e){return d+(e-d)*(a-b)/(c-b)}function readMarkersFromJSON(a){var b=[];return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Marker(c);var d=b[a].Count;d>maxCount&&(maxCount=d),d<minCount&&(minCount=d)}),b}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filter(a){var b=Object.keys(a),c=b.length,d=0,e=new Array,f=new Array;for(i=0;c>i;i++)e[i]=new Array,f[i]=new Array;var g=!1;if($.each(b,function(a,b){return"all"==b.toLowerCase()?(g=!0,resetFilters(),void resetFiltersBox()):void 0}),!g){$.each(b,function(b,c){if(!checkFilterNameIsValid(c))return void console.log("Invalid filter name!("+c+")");var g=a[c],h=getAllFilterValues(g);d++,$.each(h,function(a,c){var d=checkWhatCountriesMarkersToAdd(filterObject,c),g=d[0],h=d[1];$.each(Object.keys(g),function(a,c){var d=g[c];e[b][c]=d}),$.each(h,function(a,c){f[b].push(c)})})});var h=[];if(e.length>0){h=e[0];for(var i=0;i<e.length-1;i++)h=getCountriesIntersection(h,e[i+1])}reloadMap(h);var j=[];if(f.length>0){j=f[0];for(var i=0;i<f.length-1;i++)j=getMarkersIntersection(j,f[i+1])}addMarkersToMap(j)}}function getMarkersIntersection(a,b){var c=[];return $.each(a,function(a,d){var e=d.Country;$.each(b,function(a,b){var f=b.Country;e==f&&c.push(d)})}),c}function getCountriesIntersection(a,b){var c=[];return $.each(Object.keys(a),function(d,e){$.each(Object.keys(b),function(b,d){e==d&&(c[e]=a[e])})}),c}function applyMultipleFiltersProgramattically(a){console.log("Filters to apply: "+a);var b=Object.keys(a),c=b.length,d=[],e=[];$.each(b,function(b,c){a[c]});var f=[];map.removeAllMarkers(),$.each(jsonCountries,function(c,e){d[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!e[h])break;e[h].toLowerCase()==f.toLowerCase()&&e[i]==a[f]&&d[c]++}})}),$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==f.toLowerCase()&&d[i]==a[f]&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function applyMultipleFilters(a,b){var c=a.filter(function(a){return void 0!==a}).length,d=[],e=[];$.each(jsonCountries,function(c,e){d[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(void 0==e[h])break;e[h]===b[a].Name&&e[i]==f&&d[c]++}})});var f=[];$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==b[a].Name.toLowerCase()&&d[i]==f&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function generateColorsForTheCountries(a){a||(a=jsonCountries);var b=[];return $.each(a,function(a,c){b[c.Country]=c.Count}),b}function readCountriesFromJSON(a){var b=[];return a.length,minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Country(c),b[a].Count>maxCount&&(maxCount=b[a].Count),b[a].Count<minCount&&(minCount=b[a].Count)}),b}function setFilters(a,b){function c(){$.each(a,function(a,b){var c=b.Name,d="";d+="<li>"+c+"<ul>",$.each(b.Values,function(b,c){d+="<li filter_index="+a+">"+c+"</li>"}),d+="</ul></li>",$("#jquerymenu").append(d)}),$("#jquerymenu").menu(),$("#jquerymenu").on("menuselect",function(b,c){var d=a[c.item.attr("filter_index")],e=c.item.text();filterFromMenuSelected(d,e)})}function d(){$.each(a,function(a,b){var c=b.Name,d="";d+='<input type="radio" id="radio'+Number(a+1)+'" name="radio">',d+='<label for = "radio'+Number(a+1)+'">'+c+" </label>",$("#radioButtons").append(d)}),$("#radioButtons").buttonset(),$("#search_button").click(function(){var a=$("#search_text").val();""===a?alert("You must enter a search text"):console.log("searching for "+a)})}switch(b){case"menu":$("#checkboxes_search").hide(),c();break;case"radio":$("#jquerymenu").hide(),d();break;default:console.log("not supported filter")}}function createFiltersBox(a){var b=[];$.each(a,function(c,d){var e=d.Name.toLowerCase();e=e.charAt(0).toUpperCase()+e.slice(1);var f="dropdown"+c+"button",g="dropdown"+c,h="";h+="<p><b>"+e+":</b></p>",h+='<div class="dropdown">',h+="<button id="+f+' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>',h+="<ul id="+g+' class="dropdown-menu">',$.each(d.Values,function(a,b){h+='<li><a href="#" filterIndex='+c+" index="+a+">"+b+" </a></li>"}),h+="</ul></div>",$("#filters_box").prepend(h),$("#"+g+" li a").click(function(){var c=$(this).attr("filterIndex"),d=$(this).attr("index");$("#"+f+":first-child").text($(this).text()),$("#"+f+":first-child").val($(this).text()),b[c]=a[c].Values[d]}),$("#filters_box").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filter_box_apply_filters").click(function(){0!=b.length&&applyMultipleFilters(b,a)}),$("#filter_box_reset_filters").click(function(){$(".filter-box-dropdown").text("Select a value"),$(".filter-box-dropdown").val("Select a value");var a=[];$.each(jsonCountries,function(b,c){a[c.Country]=c.Count}),reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})})}function createFiltersBoxWithEnumeration(a){a.length,$.each(a,function(a,b){var c=b.Name.toLowerCase();c=c.charAt(0).toUpperCase()+c.slice(1);var d="";d+="<p><b>"+c+":</b></p>",d+='<div class="form-group">',d+='<input type="text" class="form-control" id="fbox'+a+'"';
var e=b.Values;d+='placeholder="'+e+'" +>',d+="</div>",$("#filters_box_enumeration").prepend(d),$("#filters_box_enumeration").tooltip({title:"Use this filter box to filter by multiple filters",placement:"bottom"})}),$("#filters_box_enum_apply_filters").click(function(){for(var b="{",c=0;c<a.length;c++){var d="#fbox"+c,e="#fbox"+(c+1),f=$(d).val(),g=$(e).val();""!==f&&(b+='"'+a[c].Name+'": "'+f+'"',""!==g&&$(e).length>0&&(b+=","))}b+="}";var h=JSON.parse(b);multiFilter(h)}),$("#filters_box_enum_reset_filters").click(function(){resetFiltersBox()})}function getAllFilterValues(a){var b=[];if(-1!=String(a).indexOf(",")){var c=String(a).split(",");$.each(c,function(a,c){if(-1!=c.indexOf("-")){var d=String(c).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(c)})}else if(-1!=a.indexOf("-")){var d=String(a).split("-");checkFilterValuesAreValid(filterObject,d);for(var e=d[0],f=d[1];f>=e;e++)b.push(e)}else b.push(a);return b}function checkWhatCountriesToAdd(a,b){var c=[];return $.each(jsonCountries,function(a,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[g]==b&&(countryValueToCheck=g,d[g]==b&&(c[d.Country]=d.Count))}}),c}function checkWhatMarkersToAdd(a,b){var c=[];return $.each(jsonMarkers,function(d,e){for(var f=0;;){f++;var g="Name"+f,h="Value"+f;if(!e[g])break;e[g]==a.Name&&e[h]==b&&c.push(e)}}),c}function checkWhatCountriesMarkersToAdd(a,b){var c=[],d=[];return c=checkWhatCountriesToAdd(a,b),d=checkWhatMarkersToAdd(a,b),[c,d]}function checkFilterNameIsValid(a){var b=!1;return $.each(jsonFiltersArray,function(c,d){return d.Name.toLowerCase()===a.toLowerCase()?(filterObject=d,void(b=!0)):void 0}),b}function checkFilterValuesAreValid(a,b){var c=!1;return $.each(b,function(a,b){return $.each(filterObject.Values,function(a,d){return d==b?void(c=!0):void 0}),c?void 0:void console.log("Invalid value for the filter: "+b)}),c}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function resetFilters(){var a=generateColorsForTheCountries();reloadMap(a),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filterFromMenuSelected(a,b){currentFilter=a;var c=checkWhatCountriesToAdd(a,b);if(reloadMap(c),$.each(jsonMarkers,function(c,d){for(var e=0;;){e++;var f="Name"+e,g="Value"+e;if(!d[f])break;d[f]===a.Name&&d[g]===b&&map.addMarker(c,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})}}),isNaN(a.Values[0]))$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide();else{$("#slider").show(),$("#minSlider").show(),$("#maxSlider").show();var d=$("#slider").slider(),e=a.Values[0],f=a.Values[a.Values.length-1];d.slider("option","min",e),d.slider("option","max",f),$("#minSlider").text(e),$("#maxSlider").text(f)}}function sliderChanged(){var a=slider.slider("option","values"),b=a[0],c=a[1],d=currentFilter.Name;$("#minSlider").text(b),$("#maxSlider").text(c);var e=[];$.each(jsonCountries,function(a,d){var f=+d[countryValueToCheck];f>=b&&c>=f&&(e[d.Country]=d.Count)}),reloadMap(e);for(var f,g=jsonCountries[0],h=0;;){h++;var i="Name"+h,j="Value"+h;if(g[i]===d){f=j;break}}$.each(jsonMarkers,function(a,d){d[f]>=b&&d[f]<=c&&map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,minRadius,maxRadius)}})})}function readFiltersFromJSON(a){for(var b=[],c=0;c<a.values.length;c++){currentFilter=a.values[c];for(var d=currentFilter.name,e=currentFilter.value,f=[],g=0;g<currentFilter.values.length;g++)f.push(currentFilter.values[g]);b[c]=new Filter(d,e,f)}return numFilters=b.length,b}function jsonMapCountries(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0;c[a]=new Country("",e,f)}),mappingCountries=c,console.log(mappingCountries)})}function jsonMapMarkers(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0,g=d[b.Latitude],h=d[b.Longitude];c[a]=new Marker("",e,f,g,h)}),mappingMarkers=c,console.log(mappingMarkers)})}function buildCountryTooltip(a,b){var c=countryTooltip;return c=c.replace("name",a.html()),c=c.replace("count",b.Count)}function buildMarkerTooltip(a,b){var c=markerTooltip;return c=c.replace("description",a[b].desc),c=c.replace("latitude",a[b].Latitude),c=c.replace("longitude",a[b].Longitude)}function reloadMap(a){$("#"+mDiv).empty(),map=new jvm.Map({map:mType,container:$("#"+mDiv),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:a}]}})}function mapRange(a,b,c,d,e){return d+(e-d)*(a-b)/(c-b)}function readMarkersFromJSON(a){var b=[];return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Marker(c);var d=b[a].Count;d>maxCount&&(maxCount=d),d<minCount&&(minCount=d)}),b}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filter(a){var b=Object.keys(a),c=b.length,d=0,e=new Array,f=new Array;for(i=0;c>i;i++)e[i]=new Array,f[i]=new Array;var g=!1;if($.each(b,function(a,b){return"all"==b.toLowerCase()?(g=!0,resetFilters(),void resetFiltersBox()):void 0}),!g){$.each(b,function(b,c){if(!checkFilterNameIsValid(c))return void console.log("Invalid filter name!("+c+")");var g=a[c],h=getAllFilterValues(g);d++,$.each(h,function(a,c){var d=checkWhatCountriesMarkersToAdd(filterObject,c),g=d[0],h=d[1];$.each(Object.keys(g),function(a,c){var d=g[c];e[b][c]=d}),$.each(h,function(a,c){f[b].push(c)})})});var h=[];if(e.length>0){h=e[0];for(var i=0;i<e.length-1;i++)h=getCountriesIntersection(h,e[i+1])}reloadMap(h);var j=[];if(f.length>0){j=f[0];for(var i=0;i<f.length-1;i++)j=getMarkersIntersection(j,f[i+1])}addMarkersToMap(j)}}function getMarkersIntersection(a,b){var c=[];return $.each(a,function(a,d){var e=d.Country;$.each(b,function(a,b){var f=b.Country;e==f&&c.push(d)})}),c}function getCountriesIntersection(a,b){var c=[];return $.each(Object.keys(a),function(d,e){$.each(Object.keys(b),function(b,d){e==d&&(c[e]=a[e])})}),c}function applyMultipleFiltersProgramattically(a){console.log("Filters to apply: "+a);var b=Object.keys(a),c=b.length,d=[],e=[];$.each(b,function(b,c){a[c]});var f=[];map.removeAllMarkers(),$.each(jsonCountries,function(c,e){d[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!e[h])break;e[h].toLowerCase()==f.toLowerCase()&&e[i]==a[f]&&d[c]++}})}),$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==f.toLowerCase()&&d[i]==a[f]&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function applyMultipleFilters(a,b){var c=a.filter(function(a){return void 0!==a}).length,d=[],e=[];$.each(jsonCountries,function(c,e){d[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(void 0==e[h])break;e[h]===b[a].Name&&e[i]==f&&d[c]++}})});var f=[];$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==b[a].Name.toLowerCase()&&d[i]==f&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function jsonMapCountries(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0;c[a]=new Country("",e,f)}),mappingCountries=c,console.log(mappingCountries)})}function jsonMapMarkers(a,b){var c=[];$.getJSON(b,function(b){$.each(a,function(a,d){var e=d[b.Country],f=0,g=d[b.Latitude],h=d[b.Longitude];c[a]=new Marker("",e,f,g,h)}),mappingMarkers=c,console.log(mappingMarkers)})}function buildCountryTooltip(a,b){var c=countryTooltip;return c=c.replace("name",a.html()),c=c.replace("count",b.Count)}function buildMarkerTooltip(a,b){var c=markerTooltip;return c=c.replace("description",a[b].desc),c=c.replace("latitude",a[b].Latitude),c=c.replace("longitude",a[b].Longitude)}function reloadMap(a){$("#"+mDiv).empty(),map=new jvm.Map({map:mType,container:$("#"+mDiv),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:a}]}})}function mapRange(a,b,c,d,e){return d+(e-d)*(a-b)/(c-b)}function readMarkersFromJSON(a){var b=[];return minCount=1/0,maxCount=-(1/0),$.each(a,function(a,c){b[a]=new Marker(c);var d=b[a].Count;d>maxCount&&(maxCount=d),d<minCount&&(minCount=d)}),b}function addMarkersToMap(a){$.each(a,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function filter(a){var b=Object.keys(a),c=b.length,d=0,e=new Array,f=new Array;for(i=0;c>i;i++)e[i]=new Array,f[i]=new Array;var g=!1;if($.each(b,function(a,b){return"all"==b.toLowerCase()?(g=!0,resetFilters(),void resetFiltersBox()):void 0}),!g){$.each(b,function(b,c){if(!checkFilterNameIsValid(c))return void console.log("Invalid filter name!("+c+")");var g=a[c],h=getAllFilterValues(g);d++,$.each(h,function(a,c){var d=checkWhatCountriesMarkersToAdd(filterObject,c),g=d[0],h=d[1];$.each(Object.keys(g),function(a,c){var d=g[c];e[b][c]=d}),$.each(h,function(a,c){f[b].push(c)})})});var h=[];if(e.length>0){h=e[0];for(var i=0;i<e.length-1;i++)h=getCountriesIntersection(h,e[i+1])}reloadMap(h);var j=[];if(f.length>0){j=f[0];for(var i=0;i<f.length-1;i++)j=getMarkersIntersection(j,f[i+1])}addMarkersToMap(j)}}function getMarkersIntersection(a,b){var c=[];return $.each(a,function(a,d){var e=d.Country;$.each(b,function(a,b){var f=b.Country;e==f&&c.push(d)})}),c}function getCountriesIntersection(a,b){var c=[];return $.each(Object.keys(a),function(d,e){$.each(Object.keys(b),function(b,d){e==d&&(c[e]=a[e])})}),c}function applyMultipleFiltersProgramattically(a){console.log("Filters to apply: "+a);var b=Object.keys(a),c=b.length,d=[],e=[];$.each(b,function(b,c){a[c]});var f=[];map.removeAllMarkers(),$.each(jsonCountries,function(c,e){d[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!e[h])break;e[h].toLowerCase()==f.toLowerCase()&&e[i]==a[f]&&d[c]++}})}),$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(b,function(b,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==f.toLowerCase()&&d[i]==a[f]&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}function applyMultipleFilters(a,b){var c=a.filter(function(a){return void 0!==a}).length,d=[],e=[];$.each(jsonCountries,function(c,e){d[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(void 0==e[h])break;e[h]===b[a].Name&&e[i]==f&&d[c]++}})});var f=[];$.each(jsonCountries,function(a,b){d[a]==c&&(f[b.Country]=b.Count)}),reloadMap(f),$.each(jsonMarkers,function(c,d){e[c]=0,$.each(a,function(a,f){for(var g=0;;){g++;var h="Name"+g,i="Value"+g;if(!d[h])break;d[h].toLowerCase()==b[a].Name.toLowerCase()&&d[i]==f&&e[c]++}})}),$.each(jsonMarkers,function(a,b){e[a]==c&&map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})}var Country=function(a,b,c){if(""==a)this.Country=b,this.Count=+c,this.Var=0,this.desc="abc";else{var d=!0,e=0;do{e++;var f="Name"+e,g="Value"+e;void 0===a[f]?d=!1:(this[f]=a[f],this[g]=a[g])}while(d);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.desc="abc"}},resetFiltersBox=function(){for(var a=0;numFilters>a;a++)$("#fbox"+a).text(""),$("#fbox"+a).val("");var b=generateColorsForTheCountries();reloadMap(b),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})},Filter=function(a,b,c){this.Name=a,this.Value=b,this.Values=c},numFilters,currentFilter,countryValueToCheck,Country=function(a,b,c){if(""==a)this.Country=b,this.Count=+c,this.Var=0,this.desc="abc";else{var d=!0,e=0;do{e++;var f="Name"+e,g="Value"+e;void 0===a[f]?d=!1:(this[f]=a[f],this[g]=a[g])}while(d);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.desc="abc"}},resetFiltersBox=function(){for(var a=0;numFilters>a;a++)$("#fbox"+a).text(""),$("#fbox"+a).val("");var b=generateColorsForTheCountries();reloadMap(b),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})},Filter=function(a,b,c){this.Name=a,this.Value=b,this.Values=c},numFilters,currentFilter,countryValueToCheck,Country=function(a,b,c){if(""==a)this.Country=b,this.Count=+c,this.Var=0,this.desc="abc";else{var d=!0,e=0;do{e++;var f="Name"+e,g="Value"+e;void 0===a[f]?d=!1:(this[f]=a[f],this[g]=a[g])}while(d);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.desc="abc"}},resetFiltersBox=function(){for(var a=0;numFilters>a;a++)$("#fbox"+a).text(""),$("#fbox"+a).val("");var b=generateColorsForTheCountries();reloadMap(b),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})},Filter=function(a,b,c){this.Name=a,this.Value=b,this.Values=c},numFilters,currentFilter,countryValueToCheck,mappingMarkers=[],mappingCountries=[];VectorialMap.prototype.registerTransformer=function(a,b,c){var b="../mappingJSON/mappingCountriesSample.json",c="../mappingJSON/mappingMarkersSample.json";return b?c?(a="../json/espid-spain.json",void $.getJSON(a,function(a){jsonMapCountries(a,b),jsonMapMarkers(a,c)})):void console.error("you must specify a markers mapping json"):void console.error("you must specify a countries mapping json")};var vectorMap,jsonFilters=[],minColorMap,maxColorMap,mDiv,mType,VectorialMap=function(){};VectorialMap.prototype.createMap=function(a,b,c,d,e,f,g){mType=g,jsonCountries=[],jsonMarkers=[],mDiv=d,minColorMap=e,maxColorMap=f,jsonCountries=readCountriesFromJSON(a.countries),a.markers?(jsonMarkers=readMarkersFromJSON(a.markers),numMarkers=jsonMarkers.length):console.log("There are no markers as input");var h=generateColorsForTheCountries();jQuery.ajax({url:"../tooltip-templates/country_tooltip.html",success:function(a){countryTooltip=a},async:!1}),jQuery.ajax({url:"../tooltip-templates/marker_tooltip.html",success:function(a){markerTooltip=a},async:!1}),map=new jvm.Map({map:mType,container:$("#"+d),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:h}]}}),a.markers&&$.each(jsonMarkers,function(a,d){map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,b,c)}})}),this.createSlider()},VectorialMap.prototype.createSlider=function(){slider=$("#slider").slider(),slider.slider("option","min",minRadius),slider.slider("option","max",maxRadius),slider.slider("option","range",!0),slider.slider("option","animate","slow"),slider.on("slidechange",function(a,b){sliderChanged()}),$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide()},VectorialMap.prototype.filterOnServer=function(a){$.getJSON("../json/serverFilter.json",function(a){var b=JSON.stringify(a),c="http://serverFiltering.com/?data="+encodeURIComponent(b);c="../json/countries_plus_markers2.json",$.getJSON(c,function(a){jsonCountries=readCountriesFromJSON(a.countries);var b=generateColorsForTheCountries(jsonCountries);reloadMap(b),a.markers&&(jsonMarkers=readMarkersFromJSON(a.markers),addMarkersToMap(jsonMarkers))})})};var Marker=function(a,b,c,d,e){if(""==a)this.Country=b,this.Count=+c,this.Var="",this.Latitude=d,this.Longitude=e,this.desc="abc";else{var f=!0,g=0;do{g++;var h="Name"+g,i="Value"+g;a[h]?(this[h]=a[h],this[i]=a[i]):f=!1}while(f);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.Latitude=a.Latitude,this.Longitude=a.Longitude,this.desc="abc"}},mappingMarkers=[],mappingCountries=[];VectorialMap.prototype.registerTransformer=function(a,b,c){var b="../mappingJSON/mappingCountriesSample.json",c="../mappingJSON/mappingMarkersSample.json";return b?c?(a="../json/espid-spain.json",void $.getJSON(a,function(a){jsonMapCountries(a,b),jsonMapMarkers(a,c)})):void console.error("you must specify a markers mapping json"):void console.error("you must specify a countries mapping json")};var vectorMap,jsonFilters=[],minColorMap,maxColorMap,mDiv,mType,VectorialMap=function(){};VectorialMap.prototype.createMap=function(a,b,c,d,e,f,g){mType=g,jsonCountries=[],jsonMarkers=[],mDiv=d,minColorMap=e,maxColorMap=f,jsonCountries=readCountriesFromJSON(a.countries),a.markers?(jsonMarkers=readMarkersFromJSON(a.markers),numMarkers=jsonMarkers.length):console.log("There are no markers as input");var h=generateColorsForTheCountries();jQuery.ajax({url:"../tooltip-templates/country_tooltip.html",success:function(a){countryTooltip=a},async:!1}),jQuery.ajax({url:"../tooltip-templates/marker_tooltip.html",success:function(a){markerTooltip=a},async:!1}),map=new jvm.Map({map:mType,container:$("#"+d),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:h}]}}),a.markers&&$.each(jsonMarkers,function(a,d){map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,b,c)}})}),this.createSlider()},VectorialMap.prototype.createSlider=function(){slider=$("#slider").slider(),slider.slider("option","min",minRadius),slider.slider("option","max",maxRadius),slider.slider("option","range",!0),slider.slider("option","animate","slow"),slider.on("slidechange",function(a,b){sliderChanged()}),$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide()},VectorialMap.prototype.filterOnServer=function(a){$.getJSON("../json/serverFilter.json",function(a){var b=JSON.stringify(a),c="http://serverFiltering.com/?data="+encodeURIComponent(b);c="../json/countries_plus_markers2.json",$.getJSON(c,function(a){jsonCountries=readCountriesFromJSON(a.countries);var b=generateColorsForTheCountries(jsonCountries);reloadMap(b),a.markers&&(jsonMarkers=readMarkersFromJSON(a.markers),addMarkersToMap(jsonMarkers))})})};var Marker=function(a,b,c,d,e){if(""==a)this.Country=b,this.Count=+c,this.Var="",this.Latitude=d,this.Longitude=e,this.desc="abc";else{var f=!0,g=0;do{g++;var h="Name"+g,i="Value"+g;a[h]?(this[h]=a[h],this[i]=a[i]):f=!1}while(f);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.Latitude=a.Latitude,this.Longitude=a.Longitude,this.desc="abc"}},Country=function(a,b,c){if(""==a)this.Country=b,this.Count=+c,this.Var=0,this.desc="abc";else{var d=!0,e=0;do{e++;var f="Name"+e,g="Value"+e;void 0===a[f]?d=!1:(this[f]=a[f],this[g]=a[g])}while(d);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.desc="abc"}},resetFiltersBox=function(){for(var a=0;numFilters>a;a++)$("#fbox"+a).text(""),$("#fbox"+a).val("");var b=generateColorsForTheCountries();reloadMap(b),$.each(jsonMarkers,function(a,b){map.addMarker(a,{latLng:[b.Latitude,b.Longitude],name:b.desc,style:{fill:"green",r:mapRange(b.Count,minCount,maxCount,minRadius,maxRadius)}})})},Filter=function(a,b,c){this.Name=a,this.Value=b,this.Values=c},numFilters,currentFilter,countryValueToCheck,mappingMarkers=[],mappingCountries=[];VectorialMap.prototype.registerTransformer=function(a,b,c){var b="../mappingJSON/mappingCountriesSample.json",c="../mappingJSON/mappingMarkersSample.json";return b?c?(a="../json/espid-spain.json",void $.getJSON(a,function(a){jsonMapCountries(a,b),jsonMapMarkers(a,c)})):void console.error("you must specify a markers mapping json"):void console.error("you must specify a countries mapping json")};var vectorMap,jsonFilters=[],minColorMap,maxColorMap,mDiv,mType,VectorialMap=function(){};VectorialMap.prototype.createMap=function(a,b,c,d,e,f,g){mType=g,jsonCountries=[],jsonMarkers=[],mDiv=d,minColorMap=e,maxColorMap=f,jsonCountries=readCountriesFromJSON(a.countries),a.markers?(jsonMarkers=readMarkersFromJSON(a.markers),numMarkers=jsonMarkers.length):console.log("There are no markers as input");var h=generateColorsForTheCountries();jQuery.ajax({url:"../tooltip-templates/country_tooltip.html",success:function(a){countryTooltip=a},async:!1}),jQuery.ajax({url:"../tooltip-templates/marker_tooltip.html",success:function(a){markerTooltip=a},async:!1}),map=new jvm.Map({map:mType,container:$("#"+d),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:h}]}}),a.markers&&$.each(jsonMarkers,function(a,d){map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,b,c)}})}),this.createSlider()},VectorialMap.prototype.createSlider=function(){slider=$("#slider").slider(),slider.slider("option","min",minRadius),slider.slider("option","max",maxRadius),slider.slider("option","range",!0),slider.slider("option","animate","slow"),slider.on("slidechange",function(a,b){sliderChanged()}),$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide()},VectorialMap.prototype.filterOnServer=function(a){$.getJSON("../json/serverFilter.json",function(a){var b=JSON.stringify(a),c="http://serverFiltering.com/?data="+encodeURIComponent(b);c="../json/countries_plus_markers2.json",$.getJSON(c,function(a){jsonCountries=readCountriesFromJSON(a.countries);var b=generateColorsForTheCountries(jsonCountries);reloadMap(b),a.markers&&(jsonMarkers=readMarkersFromJSON(a.markers),addMarkersToMap(jsonMarkers))})})};var Marker=function(a,b,c,d,e){if(""==a)this.Country=b,this.Count=+c,this.Var="",this.Latitude=d,this.Longitude=e,this.desc="abc";else{var f=!0,g=0;do{g++;var h="Name"+g,i="Value"+g;a[h]?(this[h]=a[h],this[i]=a[i]):f=!1}while(f);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.Latitude=a.Latitude,this.Longitude=a.Longitude,this.desc="abc"}},mappingMarkers=[],mappingCountries=[];VectorialMap.prototype.registerTransformer=function(a,b,c){var b="../mappingJSON/mappingCountriesSample.json",c="../mappingJSON/mappingMarkersSample.json";return b?c?(a="../json/espid-spain.json",void $.getJSON(a,function(a){jsonMapCountries(a,b),jsonMapMarkers(a,c)})):void console.error("you must specify a markers mapping json"):void console.error("you must specify a countries mapping json")};var vectorMap,jsonFilters=[],minColorMap,maxColorMap,mDiv,mType,VectorialMap=function(){};VectorialMap.prototype.createMap=function(a,b,c,d,e,f,g){mType=g,jsonCountries=[],jsonMarkers=[],mDiv=d,minColorMap=e,maxColorMap=f,jsonCountries=readCountriesFromJSON(a.countries),a.markers?(jsonMarkers=readMarkersFromJSON(a.markers),numMarkers=jsonMarkers.length):console.log("There are no markers as input");var h=generateColorsForTheCountries();jQuery.ajax({url:"../tooltip-templates/country_tooltip.html",success:function(a){countryTooltip=a},async:!1}),jQuery.ajax({url:"../tooltip-templates/marker_tooltip.html",success:function(a){markerTooltip=a},async:!1}),map=new jvm.Map({map:mType,container:$("#"+d),onMarkerTipShow:function(a,b,c){var d=buildMarkerTooltip(jsonMarkers,c);b.html(d)},onRegionTipShow:function(a,b,c){var d=-1;if($.each(jsonCountries,function(a,b){return b.Country===c?void(d=b):void 0}),-1!=d){var e=buildCountryTooltip(b,d);b.html(e)}else b.html(b.html())},series:{markers:[{scale:[minColorMap,maxColorMap],values:[minCount,maxCount],legend:{vertical:!0}}],regions:[{scale:[minColorMap,maxColorMap],attribute:"fill",values:h}]}}),a.markers&&$.each(jsonMarkers,function(a,d){map.addMarker(a,{latLng:[d.Latitude,d.Longitude],name:d.desc,style:{fill:"green",r:mapRange(d.Count,minCount,maxCount,b,c)}})}),this.createSlider()},VectorialMap.prototype.createSlider=function(){slider=$("#slider").slider(),slider.slider("option","min",minRadius),slider.slider("option","max",maxRadius),slider.slider("option","range",!0),slider.slider("option","animate","slow"),slider.on("slidechange",function(a,b){sliderChanged()}),$("#slider").hide(),$("#minSlider").hide(),$("#maxSlider").hide()},VectorialMap.prototype.filterOnServer=function(a){$.getJSON("../json/serverFilter.json",function(a){var b=JSON.stringify(a),c="http://serverFiltering.com/?data="+encodeURIComponent(b);c="../json/countries_plus_markers2.json",$.getJSON(c,function(a){jsonCountries=readCountriesFromJSON(a.countries);var b=generateColorsForTheCountries(jsonCountries);reloadMap(b),a.markers&&(jsonMarkers=readMarkersFromJSON(a.markers),addMarkersToMap(jsonMarkers))})})};var Marker=function(a,b,c,d,e){if(""==a)this.Country=b,this.Count=+c,this.Var="",this.Latitude=d,this.Longitude=e,this.desc="abc";else{var f=!0,g=0;do{g++;var h="Name"+g,i="Value"+g;a[h]?(this[h]=a[h],this[i]=a[i]):f=!1}while(f);this.Country=a.Country,this.Count=+a.Count,this.Var=a.Var,this.Latitude=a.Latitude,this.Longitude=a.Longitude,this.desc="abc"}};var mappingMarkers = [];
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
			var name = currentJSON[jsonMapping.Country];
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
			var name = currentJSON[jsonMapping.Country];
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
var vectorMap;
var jsonFilters = [];
var minColorMap;
var maxColorMap;
var mDiv;
var mType;

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputJSON, minRadius, maxRadius, mapDiv, minColor, maxColor, mapType) {
	mType = mapType;
	// countries list
	jsonCountries = [];
	// markers list
	jsonMarkers = [];
	// id of the map
	mDiv = mapDiv;
	// assign the colors for the range
	minColorMap = minColor;
	maxColorMap = maxColor;

	// read markers and jsonFilters from JSON file
	// try to read the countries
	jsonCountries = readCountriesFromJSON(inputJSON.countries);
	// try to read the markers - markers aren't mandatory
	if(!inputJSON.markers)
		console.log('There are no markers as input');
	else {
		jsonMarkers = readMarkersFromJSON(inputJSON.markers);
		numMarkers = jsonMarkers.length;
	}

	// get the Count value for each Country
	var auxColors = generateColorsForTheCountries();

	// get the tooltip templates
	// COUNTRY tooltip
	jQuery.ajax({
		url: '../tooltip-templates/country_tooltip.html',
		success: function(result) {
			countryTooltip = result;
		},
		async: false
	});

	// MARKER tooltip
	jQuery.ajax({
		url: '../tooltip-templates/marker_tooltip.html',
		success: function(result) {
			markerTooltip = result;
		},
		async: false
	});



	// add the map to the div (no markers are initially specified)
	map = new jvm.Map({
		// type of map (world, Europe, USA, etc)
		map: mType,
		// id of its container
		container: $('#' + mapDiv),
		// triggered when a marker is hovered
		onMarkerTipShow: function(e, label, index) {
			// select what text to display when marker is hovered
			var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
			label.html(finalTooltip);
		},
		// triggered when a region is hovered
		onRegionTipShow: function(e, countryName, code) {
			// code contains the code of the country (i.e., PT, ES, FR, etc)
			// show the Count associated to that Country - look for the country
			var selectedCountry = -1;
			$.each(jsonCountries, function(index, currentCountry) {
				if(currentCountry.Country === code) {
					selectedCountry = currentCountry;
					return;
				}
			});
			if(selectedCountry != -1) {
				// find occurrence of several strings inside the template
				var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
				countryName.html(finalTooltip);
			} else
				countryName.html(countryName.html());
		},
		series: {
			markers: [{
				// range of values associated with the Count
				scale: [minColorMap, maxColorMap],
				values: [minCount, maxCount],
				// add a legend
				legend: {
					vertical: true
				}
			}],
			regions: [{
				// min and max values of count
				scale: [minColorMap, maxColorMap],
				attribute: 'fill',
				values: auxColors
			}]
		}
	});

	// draw markers on the map
	if(inputJSON.markers) {
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

	// generate the slider and set corresponding values and callbacks
	this.createSlider();
};

function buildCountryTooltip(countryName, selectedCountry)
{
	var finalTooltip = countryTooltip;
	finalTooltip = finalTooltip.replace('name', countryName.html());
	finalTooltip = finalTooltip.replace('count', selectedCountry.Count);
	return finalTooltip;
}

function buildMarkerTooltip(jsonMarkers, index)
{
	var finalTooltip = markerTooltip;
	finalTooltip = finalTooltip.replace('description', jsonMarkers[index].desc);
	finalTooltip = finalTooltip.replace('latitude', jsonMarkers[index].Latitude);
	finalTooltip = finalTooltip.replace('longitude', jsonMarkers[index].Longitude);
	return finalTooltip;
}

// redraw the map
function reloadMap(colors) {
	// erase the map
	$("#" + mDiv).empty();

	map = new jvm.Map({
		map: mType,
		container: $('#' + mDiv),
		onMarkerTipShow: function(e, label, index) {
			var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
			label.html(finalTooltip);
		},
		onRegionTipShow: function(e, countryName, code) {
			// code contains the code of the country (i.e., PT, ES, FR, etc)
			// show the Count associated to that Country - look for the country
			var selectedCountry = -1;
			$.each(jsonCountries, function(index, currentCountry) {
				if(currentCountry.Country === code) {
					selectedCountry = currentCountry;
					return;
				}
			});
			if(selectedCountry != -1)
			{
				var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
				countryName.html(finalTooltip);
			}
			else
				countryName.html(countryName.html());
		},
		series: {
			markers: [{
				scale: [minColorMap, maxColorMap],
				values: [minCount, maxCount],
				legend: {
					vertical: true
				}
			}],
			regions: [{
				// min and max values of count
				scale: [minColorMap, maxColorMap],
				attribute: 'fill',
				// the colors are 'stretched' to fill the scale
				values: colors
			}]
		}
	});
}

// Auxiliary function to transpose a value from an initial range to another range
function mapRange(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

VectorialMap.prototype.createSlider = function() {

	// jQueryUI slider
	slider = $("#slider").slider();

	// set max and min value for the slider
	slider.slider("option", "min", minRadius);
	slider.slider("option", "max", maxRadius);

	// allow the user to select a range
	slider.slider("option", "range", true);

	// when user clicks the slider, it will animate to the clicked position
	slider.slider("option", "animate", "slow");

	// after selecting a new slider value
	slider.on("slidechange", function(event, ui) {
		sliderChanged();
	});

	// hide all the components until they are hidden
	$('#slider').hide();
	$('#minSlider').hide();
	$('#maxSlider').hide();
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
			if(json.markers) {
				// read the markers from the JSON file
				jsonMarkers = readMarkersFromJSON(json.markers);
				// add markers to the map
				addMarkersToMap(jsonMarkers);
			}
		});
	});
}
// Marker definition
var Marker = function (markerObject,name, count, latitude, longitude) {
	if(markerObject == '')
	{
		this.Country = name;
		this.Count = +count;
		this.Var = '';
		this.Latitude = latitude;
		this.Longitude = longitude;
		// TODO - add escription to a Marker from the JSON file
		this.desc = 'abc';
	}
	else {
		// try to read all the names and values
		var hasName = true;
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			if(!markerObject[currentNameToCheck]) {
				hasName = false;
			} else {
				this[currentNameToCheck] = markerObject[currentNameToCheck];
				this[currentValue] = markerObject[currentValue];
			}
		} while (hasName)

		this.Country = markerObject.Country;
		this.Count = +markerObject.Count;
		this.Var = markerObject.Var;
		this.Latitude = markerObject.Latitude;
		this.Longitude = markerObject.Longitude;
		// TODO - add escription to a Marker from the JSON file
		this.desc = 'abc';
	}
};

// read the markers from a JSON file
function readMarkersFromJSON(jsonMarkers) {
	var markers = [];

	minCount = Infinity;
	maxCount = -Infinity;

	$.each(jsonMarkers, function (index, currentJSONMarker) {
		markers[index] = new Marker(currentJSONMarker);
		var currentCountValue = markers[index].Count;

		if(currentCountValue > maxCount) {
			maxCount = currentCountValue;
		}
		if(currentCountValue < minCount)
			minCount = currentCountValue;
	});
	return markers;
}


function addMarkersToMap(markers) {
	$.each(markers, function (index, currentMarker) {
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
function filter(inputArgs) {

	var keys = Object.keys(inputArgs)
	var numberKeys = keys.length;
	var validFilters = 0;

	var countriesByFilter = new Array();
	var markersByFilter = new Array();
	for(i = 0; i < numberKeys; i++) {
		countriesByFilter[i] = new Array();
		markersByFilter[i] = new Array();
	}

	// check if any of the names is all (reset all applied filters	)
	var exit = false;
	$.each(keys, function(index, filterName) {
		if(filterName.toLowerCase() == 'all') {
			exit = true;
			// reloads the original markers and countries on the map
			resetFilters();
			// erase the text from the filters box
			resetFiltersBox();
			return;
		}
	});
	if(exit)
		return;

	// for every key/filter
	$.each(keys, function(index, filterName) {
		// check if the filterName is valid
		if(!checkFilterNameIsValid(filterName)) {
			// invalid filter name
			console.log('Invalid filter name!(' + filterName + ')');
			return;

		} else {
			// get the filter value (can contain enumeration and range)
			// '2004-2006' , 'F,M', etc
			var filterValue = inputArgs[filterName];
			// get all single filter values
			var finalParts = getAllFilterValues(filterValue);
			//console.log(finalParts);
			validFilters++;

			// for every single value get all the countrues and markers
			$.each(finalParts, function(i, part) {
				var checkReturn = checkWhatCountriesMarkersToAdd(filterObject, part);
				var countriesAux = checkReturn[0];
				var markersAux = checkReturn[1];
				// add every country to the list of countriesByFilter
				// add every marker to the list of markersByFilter
				$.each(Object.keys(countriesAux), function(j, currentKey) {
					// the colors that are returned are in a json format
					var keyValue = countriesAux[currentKey];
					countriesByFilter[index][currentKey] = keyValue;
				});
				// get the markers
				$.each(markersAux, function(j, currentMarker) {
					markersByFilter[index].push(currentMarker);
				});
			});
		}
	});

	// get the final countries
	var finalCountries = [];
	if(countriesByFilter.length > 0) {
		finalCountries = countriesByFilter[0];
		for(var i = 0; i < countriesByFilter.length - 1; i++)
			finalCountries = getCountriesIntersection(finalCountries, countriesByFilter[i + 1]);
	}

	// add countries to Map
	reloadMap(finalCountries);


	// get the final markers
	var finalMarkers = [];
	if(markersByFilter.length > 0) {
		finalMarkers = markersByFilter[0];
		for(var i = 0; i < markersByFilter.length - 1; i++) {
			finalMarkers = getMarkersIntersection(finalMarkers, markersByFilter[i + 1]);
		}
	}

	// add markers to the map
	addMarkersToMap(finalMarkers);

}

function getMarkersIntersection(markersGroup1, markersGroup2) {
	var markers = [];

	// markers that belong to the two groups
	$.each(markersGroup1, function(index, marker1) {
		// check if this marker name is inside the second group
		var marker1Country = marker1.Country;
		$.each(markersGroup2, function(index, marker2) {
			var marker2Country = marker2.Country;
			if(marker1Country == marker2Country)
				markers.push(marker1)
		});
	});

	return markers;
}

function getCountriesIntersection(countriesGroup1, countriesGroup2) {
	// countries that belong to the two groups
	var countries = [];

	$.each(Object.keys(countriesGroup1), function(index, countryName1) {
		// check if this country name is inside the second group
		$.each(Object.keys(countriesGroup2), function(index, countryName2) {
			if(countryName1 == countryName2)
				countries[countryName1] = countriesGroup1[countryName1];
		});
	});
	return countries;
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
		if(countriesHaveFilter[countryIndex] == numFiltersToApply)
			colors[currentCountry.Country] = currentCountry.Count;
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
