// VectorialMap
var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputMarkers, inputFilters, minRadius, maxRadius, mapDiv) {
    jsonCountries = [];
    jsonMarkers = [];
    jsonFilters = [];

    // read markers and jsonFilters from JSON file
    // try to read the countries
    jsonCountries = this.readCountriesFromJSON(inputMarkers.countries);
    // try to read the markers 
    if (!inputMarkers.markers)
        console.log('There are no markers as input');
    else
        jsonMarkers = this.readMarkersFromJSON(inputMarkers.markers);

    // try to read the filters
    jsonFilters = this.readFiltersFromJSON(inputFilters);
    numMarkers = jsonMarkers.length;

    // set the text on the UI
    $('#minSlider').text('Min radius: ' + minRadius);
    $('#maxSlider').text('Max radius: ' + maxRadius);
    $('#numMarkersDiv').text('Number of markers inside that range: ' + numMarkers);

    // generate the slider and set corresponding values and callbacks
    this.setSlider();

    // fill the Dropdown menu
    this.setDropdown(jsonFilters);

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
                    r: currentObject.mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
                }
            });
        });
    }
};

VectorialMap.prototype.setDropdown = function(jsonFilters) {

    $.each(jsonFilters, function(index, currentFilter) {
        var filterName = currentFilter.Name;
        $("#dr1").append("<li role='presentation'><a role='menuitem' tabindex='-1'>" + filterName + "</a></li>");
    });

    // when a item is selected the DROPDOWN MENU 2, filtering should be applied
    $("#dr2 >li >a").click(function() {
        var selectedFilterValue = $(this).text();

        // remove all markers from the map
        map.removeAllMarkers();
        var currentNumberMarkers = 0;

        $.each(jsonCountries, function(index, currentMarker) {
            if (currentMarker.Name1 === selectedFilterValue && currentMarker.Value1 == selectedFilterValue) {
                currentNumberMarkers++;
                map.addMarker(i, {
                    latLng: [currentMarker.latitude, currentMarker.longitude],
                    name: currentMarker.desc,
                    // set the style for this marker
                    style: {
                        fill: 'green',
                        r: currentMarker.radius
                    }
                });
            }
        });

    });

    // when a item is selected the DROPDOWN MENU 1, filtering should be applied
    $("#dr1 > li > a").click(function() {
        $("#dropdownMenu1:first-child").text($(this).text());
        $("#dropdownMenu1:first-child").val($(this).text());

        console.log('dr1');
        selectedFilterName = $(this).text();
        // update the possibilities to choose from on the second dropdown
        // fill the dropdown with the filters

        // find which filter was selected
        var selectedFilter;

        $.each(jsonFilters, function(index, currentFilter) {
            if (currentFilter.Name === selectedFilterName) {
                selectedFilter = index;
                return;
            }
        });

        // remove all child nodes
        $("#dr2").empty();
        for (var i = 0; i < jsonFilters[selectedFilter].Values.length; i++) {
            var filterValue = jsonFilters[selectedFilter].Values[i];
            $("#dr2").append("<li role='presentation'><a class='pop' role='menuitem' tabindex='-1'>" + filterValue + "</a></li>");
        }

        // remove all markers from the map
        map.removeAllMarkers();
        var currentNumberMarkers = 0;

        for (var i = 0; i < numMarkers; i++) {
            // if the marker is inside the range
            if (jsonCountries[i].Name1 === selectedFilterName) {
                currentNumberMarkers++;
                map.addMarker(i, {
                    latLng: [jsonCountries[i].latitude, jsonCountries[i].longitude],
                    name: jsonCountries[i].desc,

                    // set the style for this marker
                    style: {
                        fill: 'green',
                        r: jsonCountries[i].radius
                    }
                });
            }
        }
    });
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

VectorialMap.prototype.generateColorsForTheCountries = function() {
    var colors = [];
    $.each(jsonCountries, function(index, currentMarker) {
        var hue = currentObject.mapRange(currentMarker.Count, minCount, maxCount, 160, 220);
        colors[currentMarker.Country] = 'hsl(' + hue + ', 100%, 50%)';
    });
    return colors;
};

// Auxiliary function to transpose a value from an initial range to another range
VectorialMap.prototype.mapRange = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

VectorialMap.prototype.setSlider = function() {
    // jQueryUI slider
    var slider = $("#slider").slider();
    currentObject = this;

    // set max and min value for the slider
    slider.slider("option", "min", minRadius);
    slider.slider("option", "max", maxRadius);

    // allow the user to select a range
    slider.slider("option", "range", true);

    // when user clicks the slider, it will animate to the clicked position
    slider.slider("option", "animate", "slow");

    // after selecting a new slider value
    slider.on("slidechange", function(event, ui) {
        // get the max and min values for the currently selected range
        var currentRange = slider.slider("option", "values");
        var min = currentRange[0];
        var max = currentRange[1];

        // set the text on the UI
        $('#minSlider').text('Min radius: ' + min);
        $('#maxSlider').text('Max radius: ' + max);

        // remove all the markers from the map
        map.removeAllMarkers();

        var currentNumberMarkers = 0;

        $.each(jsonCountries, function(index, currentMarker) {
            var markerRadius = currentObject.mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
                // if the marker is inside the range
            if (markerRadius >= min && markerRadius <= max) {
                currentNumberMarkers++;
                map.addMarker(index, {
                    latLng: [currentMarker.latitude, currentMarker.longitude],
                    name: currentMarker.desc,
                    // set the style for this marker
                    style: {
                        fill: 'green',
                        r: markerRadius
                    }
                });
            }
        });
        $('#numMarkersDiv').text('Number of markers inside that range: ' + currentNumberMarkers);
    });
}

// read the markers from a JSON file
VectorialMap.prototype.readCountriesFromJSON = function(markers) {
    var returnCountries = [];
    var numJSONCountries = markers.length;

    minCount = Infinity;
    maxCount = -Infinity;

    $.each(markers, function(index, currentMarker) {
        // + is used to assure that a Number is being read
        var Count = +currentMarker.Count;
        var Gender = currentMarker.Gender;
        var Value1 = currentMarker.Value1;
        var Name1 = currentMarker.Name1;
        var Var = currentMarker.Var;
        var Cnt = currentMarker.Country;
        returnCountries[index] = new Country(Cnt, Count, Gender, Name1, Value1, Var);

        if (Count > maxCount) {
            maxCount = Count;
        }
        if (Count < minCount)
            minCount = Count;
    });
    return returnCountries;
}



// read the markers from a JSON file
VectorialMap.prototype.readMarkersFromJSON = function(markers) {
    var returnMarkers = [];

    minCount = Infinity;
    maxCount = -Infinity;

    $.each(markers, function(index, currentMarker) {
        // + is used to assure that a Number is being read
        var Count = +currentMarker.Count;
        var Gender = currentMarker.Gender;
        var Value1 = currentMarker.Value1;
        var Name1 = currentMarker.Name1;
        var Var = currentMarker.Var;
        var Latitude = currentMarker.Latitude;
        var Longitude = currentMarker.Longitude;
        var Country = currentMarker.Country;
        returnMarkers[index] = new Marker(Country, Count, Gender, Name1, Value1, Var, Latitude, Longitude);

        if (Count > maxCount) {
            maxCount = Count;
        }
        if (Count < minCount)
            minCount = Count;
    });
    return returnMarkers;
}

// Country definition 
var Country = function(Country, Count, Gender, Name1, Value1, Var) {
    this.Country = Country;
    this.Count = Count;
    this.Gender = Gender;
    this.Name1 = Name1;
    this.Value1 = Value1;
    this.Var = Var;
    this.desc = 'abc';
};

// Marker definition 
var Marker = function(Country, Count, Gender, Name1, Value1, Var, Latitude, Longitude) {
    this.Country = Country;
    this.Count = Count;
    this.Gender = Gender;
    this.Name1 = Name1;
    this.Value1 = Value1;
    this.Var = Var;
    this.Latitude = Latitude;
    this.Longitude = Longitude;
    this.desc = 'abc';
};

// Filter definition 
var Filter = function(Name, Value, Values) {
    this.Name = Name;
    this.Value = Value;
    this.Values = Values;
};

// Marker object
Filter.prototype.toString = function() {
    console.log('Filter: ' + this.Name + '\nValue: ' + this.Value);
};
