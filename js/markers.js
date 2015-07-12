// Marker definition
var Marker = function (markerObject,name, count, latitude, longitude) {
	if(markerObject == '')
	{
		this.country = name;
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

		this.country = markerObject.country;
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

function addMarkersToMap() {
    var markersJSONArray = [];
    $.each(filteredMarkers, function(index, currentMarker) {
        var currentMarkerJSON = {
            latLng: [currentMarker.Latitude, currentMarker.Longitude],
            name: currentMarker.desc,
            // set the style for this marker
            style: {
                fill: 'red',
                r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius),
                image: '../img/'+currentMarker.icon+'.png'
            }
        };
        markersJSONArray.push(currentMarkerJSON);
    });
    map.addMarkers(markersJSONArray);
}
