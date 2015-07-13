// create a new FIlter object
var Filter = function(Name, Values) {
	this.Name = Name;
	this.Values = Values;
};

// number of filters
var numFilters;
var currentFilter;
var countryValueToCheck;

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

function readFiltersFromJSON(inputFilters) {
	var filters = [];

	for(var i = 0; i < inputFilters.values.length; i++) {
		// read the current filter
		currentFilter = inputFilters.values[i];
		// fields
		var name = currentFilter.name;
		var values = [];

		for(var j = 0; j < currentFilter.values.length; j++)
			values.push(currentFilter.values[j]);
		filters[i] = new Filter(name, values);
	}
	numFilters = filters.length;
	return filters;
};
