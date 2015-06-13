function getAllFilterValues(filterValue) {
	var returnParts = [];

	// check if we have an enumeration (comma-separated values and/or ranges)
	if(String(filterValue).indexOf(",") != -1) {

		// get all the enumerated values (can be singular or range)
		var enumerationParts = String(filterValue).split(",");

		// check if we have a simple value or a range
		$.each(enumerationParts, function(index, currentEnumeration) {

			// if we have a range...
			if(currentEnumeration.indexOf("-") != -1) {

				// all the range parts
				var rangeParts = String(currentEnumeration).split("-");

				// check if the extreme values are valid
				checkFilterValuesAreValid(filterObject, rangeParts);

				// get all the values between those two numbers
				// and add them
				var min = rangeParts[0];
				var max = rangeParts[1];
				for(; min <= max; min++)
					returnParts.push(min);

			} else {
				// if we don't have a range
				// check if the single value is valid
				returnParts.push(currentEnumeration);

			}
		});
	} else {
		// just a single part
		if(filterValue.indexOf("-") != -1) {
			// we have a range
			var subParts = String(filterValue).split("-");
			// check if the extreme values are valid
			checkFilterValuesAreValid(filterObject, subParts);
			// get all the values between those two numbers
			var min = subParts[0];
			var max = subParts[1];
			for(; min <= max; min++) {
				returnParts.push(min);
			}
		} else
			returnParts.push(filterValue);
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
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentCountry[currentNameToCheck]) {
				if(currentCountry[currentNameToCheck] === selectedFilter.Name) {
					countryValueToCheck = currentValue;
					// check by value
					if(currentCountry[currentValue] == filterValue)
						countries[currentCountry.Country] = currentCountry.Count;
					
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
		// check if any of the names is equal to the selected filter
		// try to read all the names and values
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			// check if the Country has that name
			if(currentMarker[currentNameToCheck]) {
				if(currentMarker[currentNameToCheck] == selectedFilter.Name) {
					if(currentMarker[currentValue] == filterValue)
						markers.push(currentMarker);
				}
			} else {
				break;
			}
		} while (true)
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
		if(currentFilter.Name.toLowerCase() === filterName.toLowerCase()) {
			filterObject = currentFilter;
			valid = true;
			return;
		}
	});
	return valid;
}

function checkFilterValuesAreValid(filter, filterValues) {
	var valid = false;
	$.each(filterValues, function(index, part) {
		// check if the current value is valid
		$.each(filterObject.Values, function(index, currentValue) {
			if(currentValue == part) {
				console.log(currentValue + ' valid');
				valid = true;
				return;
			}
		});
		if(!valid) {
			console.log('Invalid value for the filter: ' + part);
			return;
		}
	});
	return valid;
}
