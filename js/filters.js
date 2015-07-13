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

function readFiltersFromJSON(filtersJSON) {
    var filters = [];
    $.each(filtersJSON, function(index, filter) {
        // fields
        var values = [];
        for (var j = 0; j < filter.values.length; j++)
            values.push(filter.values[j]);
        filters.push(new Filter(filter.name, values));
    });
    return filters;
}
