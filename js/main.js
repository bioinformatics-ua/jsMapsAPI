var vMaps = [];

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputJSON, minRadius, maxRadius, mapDiv, minColor, maxColor, mapType, backgroundColor, dataType, id) {
    // add the map to the VMaps array
    vMaps.push(this);

    this.id = id;
    this.background = backgroundColor;
    this.mType = mapType;
    this.datatype = dataType;
    // countries list
    this.jsonCountries = [];
    // markers list
    this.jsonMarkers = [];
    // id of the ma
    this.mDiv = mapDiv;
    // assign the colors for the range
    this.minColorMap = minColor;
    this.maxColorMap = maxColor;

    if (dataType == 'countries') {
        this.jsonCountries = this.readCountriesFromJSON(inputJSON);
        // get the tooltip templates
        // COUNTRY tooltip
        jQuery.ajax({
            url: '../tooltip-templates/country_tooltip.html',
            success: function(result) {
                countryTooltip = result;
            },
            async: false
        });
        // REGION tooltip
        jQuery.ajax({
            url: '../tooltip-templates/region_tooltip.html',
            success: function(result) {
                regionTooltip = result;
            },
            async: false
        });
    } else if (dataType == 'markers') {
        this.thereAreMarkers = true;
        this.jsonMarkers = readMarkersFromJSON(inputJSON);
        this.filteredMarkers = this.jsonMarkers;
        this.numMarkers = this.jsonMarkers.length;
        // MARKER tooltip
        jQuery.ajax({
            url: '../tooltip-templates/marker_tooltip.html',
            success: function(result) {
                markerTooltip = result;
            },
            async: false
        });
    } else {
        console.error('You must give as input a list of markers or countries!');
        return;
    }

    // get the Count value for each Country
    this.auxColors = ((this.datatype=='countries') ? this.generateColorsForTheCountries() : []);

    // marker legend
    var legendVar = {
        vertical: true
    };

    markersWithLegend = {
        scale: [this.minColorMap, this.maxColorMap],
        // range of values associated with the Count
        values: [this.minCount, this.maxCount],
        // add a legend
        legend: legendVar
    };

    markersWithoutLegend = {
        scale: [this.minColorMap, this.maxColorMap],
        // range of values associated with the Count
        values: [this.minCount, this.maxCount]
    };
    finalMarkersInMap = markersWithLegend;
    if (this.datatype == 'markers') {
        finalMarkersInMap = markersWithoutLegend;
    }

    var vMap = this;

    // create a new Map
    this.map = new jvm.Map({
        container: $('#' + vMap.mDiv),
        // configuration of the main map
        // type of map (world, Europe, USA, etc)
        map: vMap.mType,
        backgroundColor: vMap.background,
        // triggered when a marker is hovered
        onRegionClick: function(e, code) {
            countryCode = code.toLowerCase();
            var newMap = countryCode + '_mill_en';
            vMap.switchMap(newMap);
        },
        onMarkerTipShow: function(e, label, index) {
            // select what text to display when marker is hovered
            var finalTooltip = buildMarkerTooltip(vMap.jsonMarkers, vMap.jsonMarkers[index]);
            label.html(finalTooltip);
        },
        // triggered when a region is hovered
        onRegionTipShow: function(e, countryName, code) {
            // code contains the code of the country (i.e., PT, ES, FR, etc)
            var selectedCountry = -1;
            $.each(vMap.jsonCountries, function(index, currentCountry) {
                if (currentCountry.name === code) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            if (selectedCountry != -1) {
                // find occurrence of several strings inside the template
                var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
                countryName.html(finalTooltip);
            } else
                countryName.html(countryName.html());
        },
        series: {
            markers: [finalMarkersInMap],
            regions: [{
                // min and max values of count
                scale: [vMap.minColorMap, vMap.maxColorMap],
                attribute: 'fill',
                values: this.auxColors
            }]
        }
    });

    // draw markers on the map
    if (dataType == 'markers') {
        this.filteredMarkers = this.jsonMarkers
        this.addMarkersToMap();
    }
};

// Auxiliary function to transpose a value from an initial range to another range
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
