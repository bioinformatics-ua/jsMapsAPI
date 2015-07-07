var Region = function(regionObject, country) {
    // read from the input parameters
    this.Region = regionObject.name;
    this.Country = country;
    // + is used to assure that a Number is being read
    this.desc = 'just a region...';
};

function readRegionsFromJSON(regions, country) {
    var regionsArr = [];
    $.each(regions, function(index, currentRegion) {
        regionsArr[index] = new Region(currentRegion, country);
    });
    return regions;
}

function addRegionsToMap(key) {
    // check if the highlighted country has any region
    var isoCode = key.split("_")[0].toUpperCase();
    console.log(isoCode);
    // find the country with that isoCode
    $.each(jsonCountries, function(index, currentCountry) {
        if(currentCountry.Country == isoCode)
        {
            // country was found, check if it has any region
            if(currentCountry.Regions)
            {
                // highlight the regions in the map
            }
        }
    });
}
