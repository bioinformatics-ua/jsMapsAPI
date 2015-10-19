FiltersBox.prototype.readFiltersFromJSON = function(filtersJSON) {
    var filters = [];
    $.each(filtersJSON, function(index, filter) {
        filters.push(new Filter(filter));
    });
    this.filters = filters;
}

var Filter = function(filterObject) {
    this.name = filterObject['name'];
    // check if the values are continuous or discrete
    if (filterObject['continuous'] == 'false') {
        // discrete values - read from values
        this.values = [];
        this.values = filterObject['values'];
        this.continuous = false;
    } else {
        // continuous values
        this.continuous = true;
        this.min = filterObject['min']
        this.max = filterObject['max']
    }
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
