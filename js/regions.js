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
    // find the country with that isoCode
    $.each(jsonCountries, function(index, currentCountry) {
        if (currentCountry.Country == isoCode) {
            // country was found, check if it has any region
            if (currentCountry.Regions) {
                var regions = currentCountry.Regions;
                var regionColors = {};

                // fill the array with colors
                for (var regionIndex in regions) {
                    var currentRegionName = regions[regionIndex].name;
                    regionColors[currentRegionName] = "#FF00FF";
                }
                // highlight the regions in the map
                var myCustomColors = {
                    'AU-SA': '#4E7387',
                    'AU-WA': '#333333',
                    'AU-VIC': '#89AFBF',
                    'AU-TAS': '#817F8E',
                    'AU-QLD': '#344B5E',
                    'AU-NSW': '#344B5E',
                    'AU-ACT': '#344B5E',
                    'AU-NT': '#344B5E'
                };

                var palette = ['#66C2A5', '#FC8D62', '#8DA0CB', '#E78AC3', '#A6D854'];
                generateColors = function() {
                        var colors = {},
                            keyAux;

                        for (keyAux in maps.maps[key].regions) {
                            colors[keyAux] = palette[Math.floor(Math.random() * palette.length)];
                        }
                        return colors;
                    },
                    map;

                var colorsAux = generateColors();
                console.log(colorsAux);

                maps.maps[key].series = {
                    regions: [{
                        attribute: 'fill',
                        values : colorsAux
                    }]
                };

                maps.maps[key].onRegionOver = function(e,code){
                    console.log(code);
                };
                
                console.log(maps.maps[key]);
                //maps.maps[key].series.regions[0].setValues(generateColors());
            }
        }
    });
}
