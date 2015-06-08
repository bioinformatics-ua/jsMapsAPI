function multiFilter(inputArgs) {
    var keys = Object.keys(inputArgs)
    var numberKeys = keys.length;

    console.log(inputArgs)
    console.log(numberKeys);

    var validFilters = 0;

    // for every key
    $.each(keys, function(index, filterName) {
        var filterValue = inputArgs[filterName];

        // check the currentKey
        if (filterName.toLowerCase() == 'all') {
            console.log('removing all applied filters')
            resetFilters();
            return;
        }

        // check if the filterName is valid
        if (!checkFilterNameIsValid(jsonFiltersArray, filterName)) {
            // invalid filter name
            console.log('Invalid filter name!(' + filterName);
        } else {
            // if valid, check the filterValue
            var finalParts = getAllFilterValues(filterValue);
            validFilters++;
        }
    });

    // apply multiple filters
    if (validFilters == numberKeys)
        applyMultipleFiltersProgramattically(inputArgs);
}

function applyMultipleFiltersProgramattically(filtersToApply) {

    console.log(filtersToApply);

    var keys = Object.keys(filtersToApply)
    var numFiltersToApply = keys.length;
    var countriesHaveFilter = [];

    console.log(filtersToApply)
    console.log(numFiltersToApply);

    // for every key
    $.each(keys, function(index, filterName) {
        var filterValue = filtersToApply[filterName];
    });

    // erase all markers and countries from the map
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
                if (!currentCountry[currentNameToCheck])
                    break;

                if (currentCountry[currentNameToCheck].toLowerCase() == currentFilterName.toLowerCase()) {
                    // check by value
                    if (currentCountry[currentValue] == filtersToApply[currentFilterName]) {
                        countriesHaveFilter[countryIndex]++;
                    }
                }
            } while (true)
        });
    });

    // colour only the countris whose countriesHaveFilter[index] == numberFilters
    $.each(jsonCountries, function(countryIndex, currentCountry) {
        if (countriesHaveFilter[countryIndex] == numFiltersToApply) {
            colors[currentCountry.Country] = currentCountry.Count;
        }
    });

    reloadMap(colors);

    /*

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
                    if (currentMarker[currentNameToCheck] == selectedFilter.Name) {
                        if (currentMarker[currentValue] == filterValue) {
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
    */
}

function setMultipleFilters(jsonFilters) {

    var selectedMultipleFilters = [];

    $.each(jsonFilters, function(index, currentFilter) {
        var filterName = currentFilter.Name;
        var buttonId = 'dropdown' + index + 'button';
        var ulId = 'dropdown' + index;
        var toAppend = '';

        // filter text
        toAppend += '<p><b>' + filterName + ':</b></p>';
        // dropdown start
        toAppend += '<div class="dropdown">';
        // dropdown button
        toAppend += '<button id=' + buttonId + ' class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown<span class="caret"></span></button>';
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
    });

    // triggered when the search button is clicked
    $("#filter_box_apply_filters").click(function() {
        if (selectedMultipleFilters.length != 0)
            applyMultipleFilters(selectedMultipleFilters, jsonFilters);
    });
}

function applyMultipleFilters(selectedMultipleFilters, jsonFilters) {

    console.log('+');

    // number of filters to be applied
    var numFiltersToApply = selectedMultipleFilters.filter(function(value) {
        return value !== undefined
    }).length;
    var countriesHaveFilter = [];

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
                if (currentCountry[currentNameToCheck] == undefined)
                    break;

                if (currentCountry[currentNameToCheck] === jsonFilters[index].Name) {
                    // check by value
                    if (currentCountry[currentValue] == currentFilterValue) {
                        countriesHaveFilter[countryIndex]++;
                    }
                }
            } while (true)
        });
    });

    var colors = [];

    // colour only the countris whose countriesHaveFilter[index] == numberFilters
    $.each(jsonCountries, function(countryIndex, currentCountry) {
        if (countriesHaveFilter[countryIndex] == numFiltersToApply)
            colors[currentCountry.Country] = currentCountry.Count;
    });

    // colour the countries
    reloadMap(colors);
    /*

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
                    if (currentMarker[currentNameToCheck] == selectedFilter.Name) {
                        if (currentMarker[currentValue] == filterValue) {
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
    */
}
