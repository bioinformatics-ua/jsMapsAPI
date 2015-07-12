function filter(inputArgs) {

    var keys = Object.keys(inputArgs)
    var numberKeys = keys.length;
    var validFilters = 0;

    var countriesByFilter = new Array();
    var markersByFilter = new Array();
    for (i = 0; i < numberKeys; i++) {
        countriesByFilter[i] = new Array();
        markersByFilter[i] = new Array();
    }

    // check if any of the names is all (reset all applied filters	)
    var exit = false;
    $.each(keys, function(index, filterName) {
        if (filterName.toLowerCase() == 'all') {
            exit = true;
            // reloads the original markers and countries on the map
            resetFilters();
            // erase the text from the filters box
            resetFiltersBox();
            return;
        }
    });
    if (exit)
        return;

    // for every key/filter
    $.each(keys, function(index, filterName) {
        // check if the filterName is valid
        if (!checkFilterNameIsValid(filterName)) {
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
    if (countriesByFilter.length > 0) {
        finalCountries = countriesByFilter[0];
        for (var i = 0; i < countriesByFilter.length - 1; i++)
            finalCountries = getCountriesIntersection(finalCountries, countriesByFilter[i + 1]);
    }

    // add countries to Map
    reloadMap(finalCountries);

    // get the final markers
    filteredMarkers = [];
    if (markersByFilter.length > 0) {
        filteredMarkers = markersByFilter[0];
        for (var i = 0; i < markersByFilter.length - 1; i++) {
            filteredMarkers = getMarkersIntersection(filteredMarkers, markersByFilter[i + 1]);
        }
    }

    // add markers to the map
    addMarkersToMap();
}

function getMarkersIntersection(markersGroup1, markersGroup2) {
    var markers = [];

    // markers that belong to the two groups
    $.each(markersGroup1, function(index, marker1) {
        // check if this marker name is inside the second group
        var marker1Country = marker1.country;
        $.each(markersGroup2, function(index, marker2) {
            var marker2Country = marker2.country;
            if (marker1Country == marker2Country)
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
            if (countryName1 == countryName2)
                countries[countryName1] = countriesGroup1[countryName1];
        });
    });
    return countries;
}

function applyMultipleFiltersProgramattically(filtersToApply) {
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
                if (!currentCountry[currentNameToCheck])
                    break;

                if (currentCountry[currentNameToCheck].toLowerCase() == currentFilterName.toLowerCase()) {
                    // check by value
                    if (currentCountry[currentValue] == filtersToApply[currentFilterName])
                        countriesHaveFilter[countryIndex]++;
                }
            } while (true)
        });
    });

    // colour only the countris whose countriesHaveFilter[index] == numberFilters
    $.each(jsonCountries, function(countryIndex, currentCountry) {
        if (countriesHaveFilter[countryIndex] == numFiltersToApply)
            colors[currentCountry.country] = currentCountry.Count;
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
                if (!currentMarker[currentNameToCheck])
                    break;

                if (currentMarker[currentNameToCheck].toLowerCase() == currentFilterName.toLowerCase()) {
                    // check by value
                    if (currentMarker[currentValue] == filtersToApply[currentFilterName])
                        markersHaveFilter[markerIndex]++;
                }
            } while (true)
        });
    });

    // add only the markers who satisfy the criteria
    $.each(jsonMarkers, function(index, currentMarker) {
        if (markersHaveFilter[index] == numFiltersToApply) {
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
            colors[currentCountry.country] = currentCountry.Count;
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
                if (!currentMarker[currentNameToCheck])
                    break;

                if (currentMarker[currentNameToCheck].toLowerCase() == jsonFilters[index].Name.toLowerCase()) {
                    // check by value
                    if (currentMarker[currentValue] == currentFilterValue)
                        markersHaveFilter[markerIndex]++;
                }
            } while (true)
        });
    });

    // add only the markers who satisfy the criteria
    $.each(jsonMarkers, function(index, currentMarker) {
        if (markersHaveFilter[index] == numFiltersToApply) {
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
