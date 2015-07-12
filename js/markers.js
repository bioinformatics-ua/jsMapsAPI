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
			var currentNameToCheck = 'name' + i;
			var currentValue = 'value' + i;
			if(!markerObject[currentNameToCheck]) {
				hasName = false;
			} else {
				this[currentNameToCheck] = markerObject[currentNameToCheck];
				this[currentValue] = markerObject[currentValue];
			}
		} while (hasName)

		this.Country = markerObject.country;
		this.Count = +markerObject.count;
		this.Latitude = markerObject.latitude;
		this.Longitude = markerObject.longitude;
		this.icon = markerObject.icon;
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
