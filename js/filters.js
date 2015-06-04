// Filter definition 
var Filter = function(Name, Value, Values) {
    this.Name = Name;
    this.Value = Value;
    this.Values = Values;
};

filter = function(filterName, filterValue) {
    var returning = false;
    var filterObject;

    // check if the filterName is valid
    $.each(jsonFiltersArray, function(index, currentFilter) {
        if (currentFilter.Name === filterName) {
            filterObject = currentFilter;
            returning = true;
            return;
        }
    });
    if (!returning) {
        // invalid filter name
        console.log('Invalid filter name!');
    } else {
        returning = false;
        // if valid, check the filterValue

        // check if we have a range

        $.each(filterObject.Values, function(index, currentValue) {
            if (currentValue == filterValue) {
                returning = true;
                return;
            }
        });
        if (!returning)
            console.log('Invalid value for the filter!');
        else {
            // apply filtering
            filterSelected(filterObject, filterValue);
        }
    }
}

setFilters = function(jsonFilters, filterType) {

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
