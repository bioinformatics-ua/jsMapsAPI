function checkWhatCountriesToAdd() {
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
					// check by value
					if(currentCountry[currentValue] == filterValue) {
						countries[currentCountry.Country] = currentCountry.Count;
					}
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
	countriesToAdd = checkWhatCountriesToAdd();
	markersToAdd = checkWhatMarkersToAdd(selectedFilter, filterValue);

	return [countriesToAddColors, markersToAddToMap];
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
