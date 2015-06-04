// Marker definition 
var Marker = function(markerObject) {
    // try to read all the names and values
    var hasName = true;
    var i = 0;
    do {
        i++;
        var currentNameToCheck = 'Name' + i;
        var currentValue = 'Value' + i;
        if (markerObject[currentNameToCheck] === undefined) {
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