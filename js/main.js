var vectorMap;
var jsonFilters = [];
var minColorMap;
var maxColorMap;
var mDiv;
var mType;
var background;
var filteredMarkers;
var thereAreMarkers = false;

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputJSON, minRadius, maxRadius, mapDiv, minColor, maxColor, mapType, backgroundColor, dataType) {
    background = backgroundColor;
    mType = mapType;
    // countries list
    jsonCountries = [];
    // markers list
    jsonMarkers = [];
    // id of the map
    mDiv = mapDiv;
    // assign the colors for the range
    minColorMap = minColor;
    maxColorMap = maxColor;

    if (dataType == 'countries') {
        jsonCountries = readCountriesFromJSON(inputJSON);
    } else if (dataType == 'markers') {
        thereAreMarkers = true;
        jsonMarkers = readMarkersFromJSON(inputJSON);
        filteredMarkers = jsonMarkers;
        numMarkers = jsonMarkers.length;
    } else {
        console.error('You must give as input a list of markers or countries!');
        return;
    }

    // get the Count value for each Country
    auxColors = generateColorsForTheCountries();

    // get the tooltip templates
    // COUNTRY tooltip
    jQuery.ajax({
        url: '../tooltip-templates/country_tooltip.html',
        success: function(result) {
            countryTooltip = result;
        },
        async: false
    });

    // MARKER tooltip
    jQuery.ajax({
        url: '../tooltip-templates/marker_tooltip.html',
        success: function(result) {
            markerTooltip = result;
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

    var legendVar = {
        vertical: true,
        //title: 'Countries',
    };

    var markersWithLegend = {
        scale: [minColorMap, maxColorMap],
        // range of values associated with the Count
        values: [minCount, maxCount],
        // add a legend
        legend: legendVar
    };

    var markersWithoutLegend = {
        attribute: 'image',
        scale: [minColorMap, maxColorMap],
        // range of values associated with the Count
        values: [minCount, maxCount]
    };

    finalMarkersInMap = markersWithLegend;
    if (dataType == 'markers') {
        finalMarkersInMap = markersWithoutLegend;
    }


    map = new jvm.Map({
        container: $('#' + mapDiv),
        // configuration of the main map
        // type of map (world, Europe, USA, etc)
        map: mType,
        backgroundColor: background,
        // triggered when a marker is hovered
        onRegionClick: function(e, code) {
            // reload a new map
            countryCode = code.toLowerCase();
            // waitToAddMarkers(100);
            var newMap = countryCode + '_mill_en';
            // swith to new map
            switchMap(newMap);
        },
        onMarkerTipShow: function(e, label, index) {
            // select what text to display when marker is hovered
            var finalTooltip = buildMarkerTooltip(jsonMarkers, jsonMarkers[index]);
            label.html(finalTooltip);
        },
        // triggered when a region is hovered
        onRegionTipShow: function(e, countryName, code) {
            // code contains the code of the country (i.e., PT, ES, FR, etc)
            // show the Count associated to that Country - look for the country
            var selectedCountry = -1;
            $.each(jsonCountries, function(index, currentCountry) {
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
                scale: [minColorMap, maxColorMap],
                attribute: 'fill',
                values: auxColors
            }]
        }
    });

    // draw markers on the map
    if (dataType == 'markers') {
        filteredMarkers = jsonMarkers;
        addMarkersToMap();
    }
};

// Auxiliary function to transpose a value from an initial range to another range
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

VectorialMap.prototype.filterOnServer = function(filters) {
    // read the filters from a JSON file (just for testing)
    $.getJSON("../json/serverFilter.json", function(filtersJSON) {
        // convert the filtersJSON to a string
        var filtersString = JSON.stringify(filtersJSON);
        // build the url to send to the server
        var url = 'http://serverFiltering.com/?data=' + encodeURIComponent(filtersString);
        // FOR TESTING PURPOSES - this file contains a different set
        // of countries and markers
        url = '../json/countries_plus_markers2.json';
        // send request to the server to get the markers and countries
        $.getJSON(url, function(json) {
            // get the response from the server
            /*
            THIS CODE IS SERVER SIDE
            var myParam = url.split('data=')[1];
            var returnJSON = decodeURIComponent(myParam);
            console.log(JSON.parse(returnJSON));
            */

            // parse the JSON to get the countries and markers
            jsonCountries = readCountriesFromJSON(json.countries);
            // get the colours for the countries
            var countryColors = generateColorsForTheCountries(jsonCountries);
            // display the countries on the map
            reloadMap(countryColors);

            // in case we also have markers
            if (json.markers) {
                // read the markers from the JSON file
                jsonMarkers = readMarkersFromJSON(json.markers);
                // add markers to the map
                addMarkersToMap();
            }
        });
    });
}
