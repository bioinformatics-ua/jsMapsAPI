function getAllFilterValues(filterValue) {
    var returnParts = [];
    console.log(filterValue);
    // check if we have an enumeration (comma-separated values and/or ranges)
    if (String(filterValue).indexOf(",") != -1) {
        // get all the enumerated values (can be singular or range)
        var enumerationParts = String(filterValue).split(",");
        // check if we have a simple value or a range
        $.each(enumerationParts, function(index, currentEnumeration) {
            // if we have a range...
            if (currentEnumeration.indexOf("-") != -1) {
                // all the range parts
                var rangeParts = String(currentEnumeration).split("-");
                // check if the extreme values are valid
                checkFilterValuesAreValid(filterObject, rangeParts);
                // get all the values between those two numbers
                // and add them
                var min = rangeParts[0];
                var max = rangeParts[1];
                for (; min <= max; min++)
                    returnParts.push(min);
            } else {
                // if we don't have a range
                // check if the single value is valid
                returnParts.push(currentEnumeration);
            }
        });
    } else {
        // just a single part
        console.log('single');
        if (filterValue.indexOf("-") != -1) {
            // we have a range
            console.log('range');
            var subParts = String(filterValue).split("-");
            console.log(subParts);
            // check if the extreme values are valid
            checkFilterValuesAreValid(filterObject, subParts);
            // get all the values between those two numbers
            var min = subParts[0];
            var max = subParts[1];
            for (; min <= max; min++) {
                returnParts.push(min);
            }
        } else
        {
            // just a single value
            console.log('single value');
            // check the validity of this value
            checkFilterValuesAreValid(filterObject,filterValue.split(''));
            returnParts.push(filterValue);
        }
    }
    return returnParts;
}

function checkWhatCountriesToAdd(selectedFilter, filterValue) {

    var countries = [];
    $.each(jsonCountries, function(index, currentCountry) {
        // check if any of the names is equal to the selected filter
        // try to read all the names and values
        var i = 0;
        do {
            i++;
            var currentNameToCheck = 'name' + i;
            var currentValue = 'value' + i;
            // check if the Country has that name
            if (currentCountry[currentNameToCheck]) {
                if (currentCountry[currentValue] == filterValue) {
                    countryValueToCheck = currentValue;
                    // check by value
                    if (currentCountry[currentValue] == filterValue)
                        countries[currentCountry.country] = currentCountry.Count;
                }
            } else
                break;
        } while (true)
    });
    return countries;
};

function checkWhatMarkersToAdd(selectedFilter, filterValue) {
    var markers = [];
    // add only the markers who have that filter value
    $.each(jsonMarkers, function(index, currentMarker) {
        $.each(Object.keys(currentMarker), function(index, attr) {
            if (attr.toLowerCase() == selectedFilter.name.toLowerCase() && currentMarker[attr] == filterValue)
                markers.push(currentMarker)
        });
    });
    return markers;
};

function checkWhatCountriesMarkersToAdd(selectedFilter, filterValue) {
    var countriesToAdd = [];
    var markersToAdd = [];

    // check what countries to colour
    countriesToAdd = checkWhatCountriesToAdd(selectedFilter, filterValue);
    markersToAdd = checkWhatMarkersToAdd(selectedFilter, filterValue);

    return [countriesToAdd, markersToAdd];
}

function checkFilterNameIsValid(filterName) {
    var valid = false;
    $.each(jsonFiltersArray, function(index, currentFilter) {
        if (currentFilter.name.toLowerCase() === filterName.toLowerCase()) {
            filterObject = currentFilter;
            valid = true;
            return;
        }
    });
    return valid;
}

function restoreInputBoxes()
{
    console.log('restoring');
    for(var i = 0 ; i < jsonFiltersArray.length ; i++)
        $('#fbox'+i).parent().removeClass("has-error");
}

function getSelectedItems(boxID) {
    return $(boxID).dropdownCheckbox("checked");
}


function checkFilterValuesAreValid(filter, filterValues) {
    var valid = true;
    // check if the filter is continuous or not
    if (filter.continuous == true) {
        var min = filter.min;
        var max = filter.max;
        // check if the values are between min and max
        $.each(filterValues, function(index, currentValue) {
            // check if we have a value outside the range
            console.log(+currentValue);
            if (+currentValue < min || +currentValue > max) {
                valid = false;
                highlightInputBoxError(filter, currentValue);
                return;
            }
        });
    } else {
        // check if the values belong in the "values" property of the filter
        $.each(filterValues, function(index, filterValue) {
            valid = false;
            // check if the current value is valid
            $.each(filter.values, function(index, currentValue) {
                if (currentValue == filterValue) {
                    valid = true;
                    return;
                }
            });
            if(!valid)
                highlightInputBoxError(filter, filterValue);
        });
    }
    return valid;
}

function highlightInputBoxError(filter, filterValue)
{
    console.log('Invalid value for the filter: ' + filterValue);
    // highlight the input with error
    var filterToFind = filter.name;
    // find index of the filter
    $.each(jsonFiltersArray, function(index, currentFilter) {
        if(filterToFind == currentFilter.name)
            $('#fbox'+index).parent().addClass("has-error");
    });
}
