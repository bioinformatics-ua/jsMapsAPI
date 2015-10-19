var Country = function(countryObject) {
    // read from the JSON
    // add attributes
    var attributes = countryObject["attributes"];
    var country = this;
    $.each(Object.keys(attributes), function(index, attr) {
        country[attr] = attributes[attr];
    });

    // try to read its regions in case he has any
    if (countryObject.Regions)
        this.Regions = this.readRegionsFromJSON(countryObject.Regions, countryObject.country);

    this.name = countryObject.name; 
    // + is used to assure that a Number is being read
    this.count = +countryObject.count;
    this.desc = 'abc';
};

function buildCountryTooltip(countryName, country) {
    var finalTooltip = countryTooltip;
    $.each(Object.keys(country), function(index, attr) {
        finalTooltip = finalTooltip.replace(attr, country[attr]);
    });
    return finalTooltip;
}

VectorialMap.prototype.generateColorsForTheCountries = function(countries) {
    if (!countries)
        countries = this.jsonCountries;
    var countryColors = [];
    $.each(countries, function(index, currentCountry) {
        countryColors[currentCountry.name] = currentCountry.count;
    });
    return countryColors;
};

VectorialMap.prototype.readCountriesFromJSON = function(countriesJSON) {
    var countries = [];

    this.minCount = Infinity;
    this.maxCount = -Infinity;

    var vMap = this;

    $.each(countriesJSON, function(index, currentCountry) {
        countries.push(new Country(currentCountry));

        if (countries[index].count > vMap.maxCount)
            vMap.maxCount = countries[index].count;

        if (countries[index].count < vMap.minCount)
            vMap.minCount = countries[index].count;
    });
    return countries;
}

// return the country whose name is passed as an argument

VectorialMap.prototype.findCountryByName = function(countryName) {
    var returnCountry = null;
    $.each(this.jsonCountries, function(index, currentCountry) {
        if (currentCountry.name == countryName) {
            returnCountry = currentCountry;
            return returnCountry;
        }
    });
    return returnCountry;
}

// read the min and max count of the countris
VectorialMap.prototype.readMinMax = function(countries) {
    var vMap = this;
    vMap.minCount = Infinity;
    vMap.maxCount = -Infinity;

    // find country by name
    $.each(countries, function(index, currentCountry) {
        // find the country by its name
        if (currentCountry.count > vMap.maxCount)
            vMap.maxCount = currentCountry.count;

        if (currentCountry.count < vMap.minCount)
            vMap.minCount = currentCountry.count;
    });
}
