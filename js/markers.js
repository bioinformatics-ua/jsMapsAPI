// Marker definition
var Marker = function(markerObject) {
    // add attributes
    var attributes = markerObject["attributes"];
    var marker = this;
    $.each(Object.keys(attributes), function(index, attr) {
        marker[attr] = attributes[attr];
    });

    this.country = markerObject.country;
    this.count = +markerObject.count;
    this.latitude = markerObject.latitude;
    this.longitude = markerObject.longitude;
    this.icon = markerObject.icon;
    // TODO - add escription to a Marker from the JSON file
    this.desc = 'abc';
};

// read the markers from a JSON file
function readMarkersFromJSON(jsonMarkers) {
    var markers = [];

    minCount = Infinity;
    maxCount = -Infinity;

    $.each(jsonMarkers, function(index, currentJSONMarker) {
        markers.push(new Marker(currentJSONMarker));
        var currentCountValue = markers[index].Count;

        if (currentCountValue > maxCount) {
            maxCount = currentCountValue;
        }
        if (currentCountValue < minCount)
            minCount = currentCountValue;
    });
    return markers;
}

function addMarkersToMap() {
    var markersJSONArray = [];
    $.each(filteredMarkers, function(index, currentMarker) {
        var currentMarkerJSON = {
            latLng: [currentMarker.latitude, currentMarker.longitude],
            name: currentMarker.desc,
            // set the style for this marker
            style: {
                r: mapRange(currentMarker.count, minCount, maxCount, minRadius, maxRadius),
                image: '../img/' + currentMarker.icon + '.png'
            }
        };
        markersJSONArray.push(currentMarkerJSON);
    });
    map.addMarkers(markersJSONArray);
}

function buildMarkerTooltip(jsonMarkers, marker) {
    var finalTooltip = markerTooltip;
    $.each(Object.keys(marker), function(index, attr) {
        finalTooltip = finalTooltip.replace(attr, marker[attr]);
    });
    return finalTooltip;
}
