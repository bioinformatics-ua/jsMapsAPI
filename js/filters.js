// Filter definition 
var Filter = function(Name, Value, Values) {
    this.Name = Name;
    this.Value = Value;
    this.Values = Values;
};

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
    $.each(jsonCountries, function(index, currentCountry) {
        colors[currentCountry.Country] = 'rgb(255,255,255)';
    });
    map.series.regions[0].setValues(colors);
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
            var hue = mapRange(currentCountry.Count, minCount, maxCount, 160, 220);
            colors[currentCountry.Country] = 'hsl(' + hue + ', 100%, 50%)';
        }
    });

    // colour the countries
    map.series.regions[0].setValues(colors);

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

function filter(filterName, filterValue) {
    var returning = false;

    console.log(filterName)

    // check the filterName
    if (filterName.toLowerCase() == 'all') {
        console.log('removing all applied filters')
        resetFilters();
        return;
    }

    // check if the filterName is valid
    if (!checkFilterNameIsValid(jsonFiltersArray, filterName)) {
        // invalid filter name
        console.log('Invalid filter name!');
    } else {
        returning = false;
        // if valid, check the filterValue
        var finalParts = getAllFilterValues(filterValue);
        console.log('PARTS: ' + finalParts);

        // erase all markers and countries from the map
        var colors = [];
        $.each(jsonCountries, function(index, currentCountry) {
            colors[currentCountry.Country] = 'rgb(255,255,255)';
        });
        map.series.regions[0].setValues(colors);
        // remove all markers from the map
        map.removeAllMarkers();
        // apply the filtering
        $.each(finalParts, function(index, part) {
            applyFilter(filterObject, part, colors);
        });
    }
}

function checkFilterNameIsValid(jsonFilters, filterName) {
    var valid = false;
    $.each(jsonFilters, function(index, currentFilter) {
        if (currentFilter.Name.toLowerCase() === filterName.toLowerCase()) {
            filterObject = currentFilter;
            valid = true;
            return;
        }
    });
    return valid;
}

function checkFilterValueIsValid(filter, parts) {
    var valid = false;
    $.each(parts, function(index, part) {
        // check if the current value is valid
        $.each(filterObject.Values, function(index, currentValue) {
            if (currentValue == part) {
                valid = true;
                return;
            }
        });
        if (!valid) {
            console.log('Invalid value for the filter: ' + part);
            return;
        }
    });
    return valid;
}

function getAllFilterValues(filterValue) {
    // check we have an enumeration (comma-separated values and/or ranges)
    var returnParts = [];
    if (String(filterValue).indexOf(",") != -1) {
        // check if every individual value and/or range is valid
        var parts = String(filterValue).split(",");
        //returnParts.push(parts);

        // check if we have a simple value or a range
        $.each(parts, function(index, currentPart) {
            if (currentPart.indexOf("-") != -1) {
                // we have a range
                var subParts = String(currentPart).split("-");
                // check if the extreme values are valid
                checkFilterValueIsValid(filterObject, subParts);
                // get all the values between those two numbers
                var min = subParts[0];
                var max = subParts[1];
                for (; min <= max; min++) {
                    returnParts.push(min);
                }
            } else
                returnParts.push(currentPart);
        });
    } else {
        // just a single part
        if (filterValue.indexOf("-") != -1) {
            // we have a range
            var subParts = String(filterValue).split("-");
            // check if the extreme values are valid
            checkFilterValueIsValid(filterObject, subParts);
            // get all the values between those two numbers
            var min = subParts[0];
            var max = subParts[1];
            for (; min <= max; min++) {
                returnParts.push(min);
            }
        } else
            returnParts.push(filterValue);
    }
    return returnParts;
}

function resetFilters() {
    colors = [];
    $.each(jsonCountries, function(index, currentCountry) {
        var hue = mapRange(currentCountry.Count, minCount, maxCount, 160, 220);
        colors[currentCountry.Country] = 'hsl(' + hue + ', 100%, 50%)';
    });
    map.series.regions[0].setValues(colors);

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

function applyFilter(selectedFilter, filterValue, colors) {

    // check what countries to colour
    selectedCountries = [];
    $.each(jsonCountries, function(index, currentCountry) {
        // check if any of the names is equal to the selected filter
        // try to read all the names and values
        var i = 0;
        do {
            i++;
            var currentNameToCheck = 'Name' + i;
            var currentValue = 'Value' + i;
            // check if the Country has that name
            if (currentCountry[currentNameToCheck] !== undefined) {
                if (currentCountry[currentNameToCheck] === selectedFilter.Name) {
                    // check by value
                    if (currentCountry[currentValue] == filterValue) {
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

    // number of filters to be applied
    var numFiltersToApply = selectedMultipleFilters.filter(function(value) {
        return value !== undefined
    }).length;
    var countriesHaveFilter = [];

    // erase all markers and countries from the map
    var colors = [];
    $.each(jsonCountries, function(index, currentCountry) {
        colors[currentCountry.Country] = 'rgb(255,255,255)';
    });
    map.series.regions[0].setValues(colors);
    // remove all markers from the map
    map.removeAllMarkers();

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

    // colour only the countris whose countriesHaveFilter[index] == numberFilters
    $.each(jsonCountries, function(countryIndex, currentCountry) {
        if (countriesHaveFilter[countryIndex] == numFiltersToApply) {
            var hue = mapRange(currentCountry.Count, minCount, maxCount, 160, 220);
            colors[currentCountry.Country] = 'hsl(' + hue + ', 100%, 50%)';
        }
    });

    // colour the countries
    map.series.regions[0].setValues(colors);
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

function setFilters(jsonFilters, filterType) {

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

    console.log(filterValue)

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
                    if (currentCountry[currentValue] == filterValue) {
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

function sliderChanged() {
    // get the max and min values for the currently selected range
    var currentRange = slider.slider("option", "values");
    var min = currentRange[0];
    var max = currentRange[1];

    // set the text on the UI
    $('#minSlider').text(min);
    $('#maxSlider').text(max);

    // filter the Countries
    colors = [];
    $.each(selectedCountries, function(index, currentCountry) {
        if (currentCountry[selectedName] >= min && currentCountry[selectedName] <= max) {
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

function readFiltersFromJSON(inputFilters) {
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
