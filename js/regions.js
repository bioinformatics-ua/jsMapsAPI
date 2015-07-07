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
        if (currentCountry.Country == isoCode) {
            // country was found, check if it has any region
            if (currentCountry.Regions) {
                var regions = currentCountry.Regions;;
                console.log(maps.maps[key]);
                var regionColors = {};

                // fill the array with colors
                for(var regionIndex in regions){
                    var currentRegionName = regions[regionIndex].name;
                    regionColors[currentRegionName] = "#FF00FF";
                }

                console.log(regionColors);
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
               console.log(maps.maps[key].params.series);
               maps.series.regions[0].setValues(myCustomColors);
               //mapObject.series.regions[0].setVa  lues(regionColors);

               /*
               map = new jvm.WorldMap({
                   map: 'au_merc_en',
                   container: $('#ausie'),
                   backgroundColor: '#eff7ff',
                   series: {
                       regions: [{
                           attribute: 'fill'
                       }]
                   }
               });


                */
            }
        }
    });
}
