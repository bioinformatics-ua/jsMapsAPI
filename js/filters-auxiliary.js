FiltersBox.prototype.getAllFilterValues = function(filterValue) {
    var fBox = this;
    var returnParts = [];
    // check if we have an enumeration (comma-separated values and/or ranges)
    if (String(filterValue).indexOf(",") != -1) {
        console.log('enumeration');
        // get all the enumerated values (can be singular or range)
        var enumerationParts = String(filterValue).split(",");
        // check if we have a simple value or a range
        $.each(enumerationParts, function(index, currentEnumeration) {
            // if we have a range...
            if (currentEnumeration.indexOf("-") != -1) {
                console.log('range inside enumeration');
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
                console.log('no range inside enumeration');
                var valid = fBox.checkFilterValuesAreValid(filterObject,[currentEnumeration]);
                if(valid) returnParts.push(currentEnumeration);
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
            var valid = fBox.checkFilterValuesAreValid(filterObject, subParts);
            console.log(valid);
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
            var valid = fBox.checkFilterValuesAreValid(filterObject,[filterValue]);
            if(valid) returnParts.push(filterValue);
        }
    }
    return returnParts;
}

FiltersBox.prototype.checkWhatCountriesToAdd = function(selectedFilter, filterValue, map) {
    var countries = [];
    $.each(map.jsonCountries, function(index, country) {
        $.each(Object.keys(country), function(index, attr) {
            if (attr.toLowerCase() == selectedFilter.name.toLowerCase() && country[attr] == filterValue)
            {
                countries.push(country)
            }
        });
    });
    return countries;
};

FiltersBox.prototype.checkWhatMarkersToAdd = function(selectedFilter, filterValue, map) {
    var markers = [];
    // add only the markers who have that filter value
    $.each(map.jsonMarkers, function(index, currentMarker) {
        $.each(Object.keys(currentMarker), function(index, attr) {
            if (attr.toLowerCase() == selectedFilter.name.toLowerCase() && currentMarker[attr] == filterValue)
                markers.push(currentMarker)
        });
    });
    return markers;
};

FiltersBox.prototype.checkWhatCountriesMarkersToAdd = function(selectedFilter, filterValue, map) {
    var countriesToAdd = [];
    var markersToAdd = [];

    if(map.datatype == 'countries')
        countriesToAdd = this.checkWhatCountriesToAdd(selectedFilter, filterValue, map);
    else
        markersToAdd = this.checkWhatMarkersToAdd(selectedFilter, filterValue, map);

    return [countriesToAdd, markersToAdd];
}

FiltersBox.prototype.checkFilterNameIsValid = function(filterName) {
    var valid = false;
    $.each(this.filters, function(index, currentFilter) {
        if (currentFilter.name.toLowerCase() === filterName.toLowerCase()) {
            filterObject = currentFilter;
            valid = true;
            return;
        }
    });
    return valid;
}

FiltersBox.prototype.restoreInputBoxes = function(){
    var fBox = this;
    for(var i = 0 ; i < this.filters.length ; i++)
        $('#fbox' + i + '-'+fBox.map).parent().removeClass("has-error");
}

function getSelectedItems(boxID) {
    return $(boxID).dropdownCheckbox("checked");
}


FiltersBox.prototype.checkFilterValuesAreValid = function(filter, filterValues) {
    var fBox = this;
    var valid = true;
    // check if the filter is continuous or not
    if (filter.continuous == true) {
        var min = filter.min;
        var max = filter.max;
        // check if the values are between min and max
        $.each(filterValues, function(index, currentValue) {
            // check if we have a value outside the range
            if (+currentValue < min || +currentValue > max) {
                valid = false;
                fBox.highlightInputBoxError(filter, currentValue);
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
                fBox.highlightInputBoxError(filter, filterValue);
        });
    }
    return valid;
}

FiltersBox.prototype.highlightInputBoxError = function(filter, filterValue){
    var fBox = this;
    console.log('Invalid value for the filter: ' + filterValue);
    // highlight the input with error
    var filterToFind = filter.name;
    // find index of the filter
    $.each(fBox.filters, function(index, filter) {
        if(filterToFind == filter.name)
            $('#fbox' + index + '-'+fBox.map).parent().addClass("has-error");
    });
}
