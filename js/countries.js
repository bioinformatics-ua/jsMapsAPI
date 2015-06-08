// Country definition 
var Country = function(countryObject) {
    // try to read all the names and values
    var hasName = true;
    var i = 0;
    do {
        i++;
        var currentNameToCheck = 'Name' + i;
        var currentValue = 'Value' + i;
        if (countryObject[currentNameToCheck] === undefined) {
            hasName = false;
        } else {
            this[currentNameToCheck] = countryObject[currentNameToCheck];
            this[currentValue] = countryObject[currentValue];
        }
    } while (hasName)

    this.Country = countryObject.Country;
    // + is used to assure that a Number is being read
    this.Count = +countryObject.Count;
    this.Var = countryObject.Var;
    this.desc = 'abc';
};

function generateColorsForTheCountries() {
    var colors = [];
    $.each(jsonCountries, function(index, currentCountry) {
        colors[currentCountry.Country] = currentCountry.Count;
    });
    return colors;
};

function readCountriesFromJSON(markers) {
    var returnCountries = [];
    var numJSONCountries = markers.length;

    minCount = Infinity;
    maxCount = -Infinity;

    $.each(markers, function(index, currentCountry) {
        returnCountries[index] = new Country(currentCountry);

        if (returnCountries[index].Count > maxCount) {
            maxCount = returnCountries[index].Count;
        }
        if (returnCountries[index].Count < minCount)
            minCount = returnCountries[index].Count;
    });
    return returnCountries;
}
