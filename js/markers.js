// Marker definition
var Marker = function (markerObject) {
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
	this.desc = 'abc';
};


// read the markers from a JSON file
function readMarkersFromJSON(markers) {
	var returnMarkers = [];

	minCount = Infinity;
	maxCount = -Infinity;

	$.each(markers, function (index, currentMarker) {
		returnMarkers[index] = new Marker(currentMarker);
		var Count = returnMarkers[index].Count;

		if(Count > maxCount) {
			maxCount = Count;
		}
		if(Count < minCount)
			minCount = Count;
	});
	return returnMarkers;
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
