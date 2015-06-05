//var selectedFilterGlobal;
var selectedCountries;
var selectedMarkers;
var selectedName;
var vectorMap;
var jsonFilters = [];

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputMarkers, minRadius, maxRadius, mapDiv) {
    jsonCountries = [];
    jsonMarkers = [];

    // read markers and jsonFilters from JSON file
    // try to read the countries
    jsonCountries = this.readCountriesFromJSON(inputMarkers.countries);
    // try to read the markers 
    if (!inputMarkers.markers)
        console.log('There are no markers as input');
    else
        jsonMarkers = this.readMarkersFromJSON(inputMarkers.markers);

    numMarkers = jsonMarkers.length;


    // no markers are initially specified
    map = new jvm.Map({
        map: 'world_mill_en',
        container: $('#' + mapDiv),
        onMarkerTipShow: function(e, label, index) {
            map.tip.text(jsonMarkers[index].Latitude + ', ' + jsonMarkers[index].Longitude + '-' + jsonMarkers[index].desc);
        },
        onRegionTipShow: function(e, countryName, code) {
            // code contains the code of the country (i.e., PT, ES, FR, etc)
            // show the Count associated to that Country - look for the country
            var selectedCountry = -1;
            $.each(jsonCountries, function(index, currentCountry) {
                if (currentCountry.Country === code) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            if (selectedCountry != -1)
                countryName.html(countryName.html() + ' (' + selectedCountry.Count + ') ');
            else
                countryName.html(countryName.html());
        },
        series: {
            markers: [{
                attribute: 'fill',
                scale: ['#C8EEFF', '#0071A4'],
                normalizeFunction: 'polynomial',
                values: [100, 512, 550, 1081, 1200],
                legend: {
                    vertical: true
                }
            }],
            regions: [{
                attribute: 'fill'
            }]
        }
    });

    // give colors to the map regions
    map.series.regions[0].setValues(this.generateColorsForTheCountries());

    // generate the slider and set corresponding values and callbacks
    this.setSlider();

    // draw markers on the map
    if (inputMarkers.markers) {
        // draw markers on the map
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
};

// Auxiliary function to transpose a value from an initial range to another range
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

VectorialMap.prototype.generateColorsForTheCountries = function() {
    var colors = [];
    $.each(jsonCountries, function(index, currentMarker) {
        var hue = mapRange(currentMarker.Count, minCount, maxCount, 160, 220);
        colors[currentMarker.Country] = 'hsl(' + hue + ', 100%, 50%)';
    });
    return colors;
};

VectorialMap.prototype.setSlider = function() {
    // set the text on the UI
    $('#minSlider').text('Min radius: ' + minRadius);
    $('#maxSlider').text('Max radius: ' + maxRadius);
    $('#numMarkersDiv').text('Number of markers inside that range: ' + numMarkers);

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

VectorialMap.prototype.readFiltersFromJSON = function(inputFilters) {
    var filtersReturn = [];

    // read filters from JSON
    for (var i = 0; i < inputFilters.values.length; i++) {
        // read the current filter
        currentFilter = inputFilters.values[i];
        // fields
        var name = currentFilter.name;
        var value = currentFilter.value;
        var values = [];

        for (var j = 0; j < currentFilter.values.length; j++)
            values.push(currentFilter.values[j]);
        filtersReturn[i] = new Filter(name, value, values);
    }
    return filtersReturn;
};

VectorialMap.prototype.readCountriesFromJSON = function(markers) {
    var returnCountries = [];
    var numJSONCountries = markers.length;

    minCount = Infinity;
    maxCount = -Infinity;

    $.each(markers, function(index, currentCountry) {
        returnCountries[index] = new Country(currentCountry);

        if (returnCountries[index].Count > maxCount) {
            maxCount = returnCountries[index].Count;
        }
        if (returnCountries[index].Count < minCount)
            minCount = returnCountries[index].Count;
    });
    return returnCountries;
}

// read the markers from a JSON file
VectorialMap.prototype.readMarkersFromJSON = function(markers) {
    var returnMarkers = [];

    minCount = Infinity;
    maxCount = -Infinity;

    $.each(markers, function(index, currentMarker) {
        returnMarkers[index] = new Marker(currentMarker);
        var Count = returnMarkers[index].Count;

        if (Count > maxCount) {
            maxCount = Count;
        }
        if (Count < minCount)
            minCount = Count;
    });
    return returnMarkers;
}