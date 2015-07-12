// Marker definition
var Marker = function (markerObject, name, count, latitude, longitude) {
	if(markerObject == '')
	{
		this.country = name;
		this.Count = +count;
		this.Var = '';
		this.Latitude = latitude;
		this.Longitude = longitude;
		// TODO - add description to a Marker from the JSON file
		this.desc = 'abc';
	}
	else {
		// add attributes
		var attributes = markerObject["attributes"];
		var marker = this;
		$.each(Object.keys(attributes), function(index, attr) {
			marker[attr] = attributes[attr];
		});

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

function buildMarkerTooltip(jsonMarkers, index) {
    var finalTooltip = markerTooltip;
    finalTooltip = finalTooltip.replace('description', jsonMarkers[index].desc);
    finalTooltip = finalTooltip.replace('latitude', jsonMarkers[index].Latitude);
    finalTooltip = finalTooltip.replace('longitude', jsonMarkers[index].Longitude);
    return finalTooltip;
}
