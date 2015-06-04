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

    // fill the Dropdown menu
    //this.setFilters(jsonFilters, filterType);

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


VectorialMap.prototype.setFilters = function(jsonFilters, filterType) {

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
            filterSelected(selectedFilter, filterValue);
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
            if (searchText === '')
                alert('You must enter a search text');
            else
                console.log('searching for ' + searchText);

            // get the selected radio button

        });
    }

    switch (filterType) {
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
    $.each(jsonCountries, function(index, currentCountry) {
        // check if any of the names is equal to the selected filter
        // try to read all the names and values
        var i = 0;
        // colour the COuntry white so it won't be selected
        colors[currentCountry.Country] = 'rgb(255,255,255)';
        do {
            i++;
            var currentNameToCheck = 'Name' + i;
            var currentValue = 'Value' + i;
            // check if the Country has that name
            if (currentCountry[currentNameToCheck] !== undefined) {
                if (currentCountry[currentNameToCheck] === selectedFilter.Name) {
                    // check by value
                    if (currentCountry[currentValue] === filterValue) {
                        console.log('+')
                        var hue = mapRange(currentCountry.Count, minCount, maxCount, 160, 220);
                        colors[currentCountry.Country] = 'hsl(' + hue + ', 100%, 50%)';
                        selectedCountries.push(currentCountry);
                    }
                }
            } else
                break;
        } while (true)
    });
    map.series.regions[0].setValues(colors);

    console.log(selectedCountries)

    // remove all markers from the map
    map.removeAllMarkers();

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
            if (currentMarker[currentNameToCheck] !== undefined) {
                if (currentMarker[currentNameToCheck] === selectedFilter.Name) {
                    if (currentMarker[currentValue] === filterValue) {
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
    if (!isNaN(selectedFilter.Values[0])) {
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

sliderChanged = function() {

    // get the max and min values for the currently selected range
    var currentRange = slider.slider("option", "values");
    var min = currentRange[0];
    var max = currentRange[1];

    // set the text on the UI
    $('#minSlider').text(min);
    $('#maxSlider').text(max);

    // filter the Countries
    colors = [];
    console.log(selectedCountries)
    $.each(selectedCountries, function(index, currentCountry) {
        if (currentCountry[selectedName] >= min && currentCountry[selectedName] <= max) {
            console.log('+')
            var hue = mapRange(currentCountry.Count, minCount, maxCount, 160, 220);
            colors[currentCountry.Country] = 'hsl(' + hue + ', 100%, 50%)';
        } else
            colors[currentCountry.Country] = 'rgb(255,255,255)';
    });
    map.series.regions[0].setValues(colors);

    // filter the Markers
    // first, remove all markers
    map.removeAllMarkers();

    // add only the markers who have that filter value
    $.each(jsonMarkers, function(index, currentMarker) {
        // check if the Country has that name
        if (currentMarker[selectedName] >= min && currentMarker[selectedName] <= max) {
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

// read the filters from a JSON file
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

// read the markers from a JSON file
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

// Country definition 
var Country = function(countryObject) {
    // try to read all the names and values
    var hasName = true;
    var i = 0;
    do {
        i++;
        var currentNameToCheck = 'Name' + i;
        var currentValue = 'Value' + i;
        if (countryObject[currentNameToCheck] === undefined) {
            hasName = false;
        } else {
            this[currentNameToCheck] = countryObject[currentNameToCheck];
            this[currentValue] = countryObject[currentValue];
        }
    } while (hasName)

    this.Country = countryObject.Country;
    // + is used to assure that a Number is being read
    this.Count = +countryObject.Count;
    this.Var = countryObject.Var;
    this.desc = 'abc';
};

// Marker definition 
var Marker = function(markerObject) {
    // try to read all the names and values
    var hasName = true;
    var i = 0;
    do {
        i++;
        var currentNameToCheck = 'Name' + i;
        var currentValue = 'Value' + i;
        if (markerObject[currentNameToCheck] === undefined) {
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
    this.desc = 'abc';
};

// Filter definition 
var Filter = function(Name, Value, Values) {
    this.Name = Name;
    this.Value = Value;
    this.Values = Values;
};
