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
		filter(filtersToApply);
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
