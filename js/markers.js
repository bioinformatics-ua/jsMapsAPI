// Marker definition
var Marker = function (markerObject,name, count, latitude, longitude) {
	if(markerObject == '')
	{
		this.Country = name;
		this.Count = +count;
		this.Var = '';
		this.Latitude = latitude;
		this.Longitude = longitude;
		// TODO - add escription to a Marker from the JSON file
		this.desc = 'abc';
	}
	else {
		// try to read all the names and values
		var hasName = true;
		var i = 0;
		do {
			i++;
			var currentNameToCheck = 'Name' + i;
			var currentValue = 'Value' + i;
			if(!markerObject[currentNameToCheck]) {
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
		// TODO - add escription to a Marker from the JSON file
		this.desc = 'abc';
	}
};

// read the markers from a JSON file
function readMarkersFromJSON(jsonMarkers) {
	var markers = [];

	minCount = Infinity;
	maxCount = -Infinity;

	$.each(jsonMarkers, function (index, currentJSONMarker) {
		markers[index] = new Marker(currentJSONMarker);
		var currentCountValue = markers[index].Count;

		if(currentCountValue > maxCount) {
			maxCount = currentCountValue;
		}
		if(currentCountValue < minCount)
			minCount = currentCountValue;
	});
	return markers;
}


function addMarkersToMap(markers) {
	$.each(markers, function (index, currentMarker) {
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
