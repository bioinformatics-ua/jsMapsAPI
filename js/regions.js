var Region = function(regionObject, country) {
    // read from the input parameters
    this.region = regionObject.name;
    this.country = country;
    // + is used to assure that a Number is being read
    this.desc = 'just a region...';
};

VectorialMap.prototype.readRegionsFromJSON = function(regions, country) {
    var regionsArr = [];
    $.each(regions, function(index, currentRegion) {
        regionsArr.push(new Region(currentRegion, country));
    });
    return regions;
}

VectorialMap.prototype.generateColorsForTheRegions = function(country){
    var isoCode = country.split("_")[0].toUpperCase();
    // find the country with that isoCode
    var regionColors = [];
    $.each(jsonCountries, function(index, currentCountry) {
        if (currentCountry.country == isoCode) {
            // country was found, check if it has any region
            if (currentCountry.Regions) {
                var regions = currentCountry.Regions;
                // get the regions of the country
            	$.each(regions, function(index, currentRegion) {
            		regionColors[currentRegion.name] = 100;
            	});
            }
        }
    });
	return regionColors;
}


function buildRegionTooltip(region) {
    var finalTooltip = regionTooltip;
    finalTooltip = finalTooltip.replace('name', region.name);
    return finalTooltip;
}

VectorialMap.prototype.addRegionsToMap = function(key) {
    // check if the highlighted country has any region
    var isoCode = key.split("_")[0].toUpperCase();
    // find the country with that isoCode
    $.each(jsonCountries, function(index, currentCountry) {
        if (currentCountry.country == isoCode) {
            // country was found, check if it has any region
            if (currentCountry.Regions) {
                var regions = currentCountry.Regions;
                var palette = ['#66C2A5', '#FC8D62', '#8DA0CB', '#E78AC3', '#A6D854'];
                function generateColors() {
                    var colors = {},
                        key;
                    colors[maps.region]

                    for (key in maps.regions) {
                        colors[key] = palette[Math.floor(Math.random() * palette.length)];
                    }
                    return colors;
                };
                console.log(generateColors());
                // set the colors of the regions
                maps.series.regions[0].setValues(generateColors());
            }
        }
    });
}
