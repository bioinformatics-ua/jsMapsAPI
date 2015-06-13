var vectorMap;
var jsonFilters = [];
var minColorMap;
var maxColorMap;
var mDiv;

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputMarkers, minRadius, maxRadius, mapDiv, minColor, maxColor) {
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
	jsonCountries = readCountriesFromJSON(inputMarkers.countries);
	// try to read the markers - markers aren't mandatory
	if(!inputMarkers.markers)
		console.log('There are no markers as input');
	else {
		jsonMarkers = readMarkersFromJSON(inputMarkers.markers);
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
				countryName.html(countryName.html() + ' (' + selectedCountry.Count + ') ');
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
	if(inputMarkers.markers) {
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
