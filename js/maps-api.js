var vectorMap;
var jsonFilters = [];
var minColorMap;
var maxColorMap;
var mDiv;

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputJSON, minRadius, maxRadius, mapDiv, minColor, maxColor) {
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

	// add the map to the div (no markers are initially specified)
	map = new jvm.Map({
		// type of map (world, Europe, USA, etc)
		map: 'world_mill_en',
		// id of its container
		container: $('#' + mapDiv),
		// triggered when a marker is hovered
		onMarkerTipShow: function(e, label, index) {
			map.tip.text(jsonMarkers[index].Latitude + ', ' + jsonMarkers[index].Longitude + '-' + jsonMarkers[index].desc);
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
			if(selectedCountry != -1)
			{

				var htm = '';
				htm += '<div style="color:#bf2727; background-color: yellow">';
				htm += '<h3>This is a heading in a div element</h3>';
				htm += '<p>This is some text in a div element.</p></div>';
				
				//countryName.html(countryName.html() + ' (' + selectedCountry.Count + ') ');
				countryName.html(htm);

			}
			else
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

// redraw the map
function reloadMap(colors) {
	// erase the map
	$("#" + mDiv).empty();

	map = new jvm.Map({
		map: 'world_mill_en',
		container: $('#' + mDiv),
		onMarkerTipShow: function(e, label, index) {
			map.tip.text(jsonMarkers[index].Latitude + ', ' + jsonMarkers[index].Longitude + '-' + jsonMarkers[index].desc);
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
				countryName.html(countryName.html() + ' (' + selectedCountry.Count + ') ');
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
			if(json.markers)
			{
				// read the markers from the JSON file
				jsonMarkers = readMarkersFromJSON(json.markers);
				// add markers to the map
				addMarkersToMap(jsonMarkers);
			}
		});
	});
}
