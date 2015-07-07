var vectorMap;
var jsonFilters = [];
var minColorMap;
var maxColorMap;
var mDiv;
var mType;
var background;

var VectorialMap = function() {};

// VectorialMap Prototype
VectorialMap.prototype.createMap = function(inputJSON, minRadius, maxRadius, mapDiv, minColor, maxColor, mapType, backgroundColor) {
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

    if (!inputJSON.countries && !inputJSON.markers) {
        console.error();
        ('You must give as input a list of markers or countries!');
        return;
    }
    if (inputJSON.countries) {
        jsonCountries = readCountriesFromJSON(inputJSON.countries);
    }
    if (inputJSON.markers) {
        jsonMarkers = readMarkersFromJSON(inputJSON.markers);
        numMarkers = jsonMarkers.length;
    }

    // get the Count value for each Country
    var auxColors = generateColorsForTheCountries();

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

    maps = new jvm.MultiMap({
        container: $('#' + mapDiv),
        maxLevel: 1,
        // configuration of the main map
        main: {
            // type of map (world, Europe, USA, etc)
            map: mType,
            backgroundColor: background,
            // id of its container
            container: $('#' + mapDiv),
            // triggered when a marker is hovered
            onMarkerTipShow: function(e, label, index) {
                // select what text to display when marker is hovered
                var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
                label.html(finalTooltip);
            },
            // triggered when a region is hovered
            onRegionTipShow: function(e, countryName, code) {
                // code contains the code of the country (i.e., PT, ES, FR, etc)
                // show the Count associated to that Country - look for the country
                var selectedCountry = -1;
                $.each(jsonCountries, function(index, currentCountry) {
                    if (currentCountry.Country === code) {
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
                markers: [{
                    scale: [minColorMap, maxColorMap],
                    // range of values associated with the Count
                    values: [minCount, maxCount],
                    // add a legend
                    legend: {
                        vertical: true
                    }
                }],
                regions: [{
                    // min and max values of count
                    scale: [minColorMap, maxColorMap],
                    attribute: 'fill',
                    values: auxColors
                }]
            }

        },
        regionStyle: {
            initial: {
                fill: '#B8E186'
            }
        },
        series: {
            regions: [{
                attribute: 'fill'
            }]
        },
        mapUrlByCode: function(code, multiMap) {
            // access a new map by drilldown
            countryCode = code.toLowerCase();
            waitToAddMarkers(100);
            var mapName = countryCode + '_' + multiMap.defaultProjection + '_en';
            return '/lib/jvectormap/maps/' + countryCode + '-' + multiMap.defaultProjection + '-en.js';
        }
    });

    // draw markers on the map
    if (inputJSON.markers) {
        addMarkersToMultiMap(jsonMarkers);
    }

    // generate the slider and set corresponding values and callbacks
    this.createSlider();
};

function addMarkersTooltip(currentMap) {
    var jvmMapMain = new jvm.Map({
        map: mType,
        backgroundColor: background,
        container: $('#nada'),
        onMarkerTipShow: function(e, label, index) {
            var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
            label.html(finalTooltip);
        },
        onRegionTipShow: function(e, countryName, code) {
            // code contains the code of the country (i.e., PT, ES, FR, etc)
            // show the Count associated to that Country - look for the country
            var selectedCountry = -1;
            $.each(jsonCountries, function(index, currentCountry) {
                if (currentCountry.Country === code) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            if (selectedCountry != -1) {
                var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
                countryName.html(finalTooltip);
            } else
                countryName.html(countryName.html());
        },
        series: {
            markers: [{
                // change the scale to fit the current min and max values
                scale: [minColorMap, maxColorMap],
                values: [minCount, maxCount],
                legend: {
                    vertical: true
                }
            }],
            regions: [{
                // min and max values of count
                scale: [minColorMap, maxColorMap],
                attribute: 'fill',
                // the colors are 'stretched' to fill the scale
                values: []
            }]
        }
    });

    // get the onMarkerFunction of the main map (world map)
    var onMarkerFunction = maps.maps[mapType].params.onMarkerTipShow;
    maps.maps[currentMap].params.onMarkerTipShow = jvmMapMain.params.onMarkerTipShow;
    maps.maps[currentMap].params.series = jvmMapMain.params.series;
    maps.maps[currentMap].params.onRegionTipShow = jvmMapMain.params.onRegionTipShow;
}

function waitToAddMarkers(waitingTime) {
    // wait some time
    setTimeout(function() {
        // check if the country code already belongs to the maps object
        availableMaps = maps.maps;
        //console.log(availableMaps);
        // add the markers to the map
        var found = false;
        // the marker must be added to all the existing maps
        for (var key in availableMaps) {
            if (key == countryCode + '_mill_en')
                found = true;
        };
        // if it does, add the markers
        if (found) {
            addMarkersToThisMap(key);
            addMarkersTooltip(key);
            addRegionsToMap(key);
        }
        // if it doesn't, wait more time
        else
            waitToAddMarkers(100);
    }, waitingTime);
}

function addMarkersToThisMap(currentMap) {
    // add the markers to the map
    $.each(jsonMarkers, function(index, currentMarker) {
        // the marker must be added to all the existing maps
        // add a marker to every map
        maps.maps[currentMap].addMarker(index, {
            latLng: [currentMarker.Latitude, currentMarker.Longitude],
            name: currentMarker.desc,
            // set the style for this marker
            style: {
                fill: 'green',
                r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
            }
        });
    });
}

function buildCountryTooltip(countryName, selectedCountry) {
    var finalTooltip = countryTooltip;
    finalTooltip = finalTooltip.replace('name', countryName.html());
    finalTooltip = finalTooltip.replace('count', selectedCountry.Count);
    return finalTooltip;
}

function buildMarkerTooltip(jsonMarkers, index) {
    var finalTooltip = markerTooltip;
    finalTooltip = finalTooltip.replace('description', jsonMarkers[index].desc);
    finalTooltip = finalTooltip.replace('latitude', jsonMarkers[index].Latitude);
    finalTooltip = finalTooltip.replace('longitude', jsonMarkers[index].Longitude);
    return finalTooltip;
}

// redraw the map
function reloadMap(colors) {
    // update min and max Count of the countries
    if (jsonCountries.length > 0)
        readMinMax(colors);


    // erase the map
    $("#" + mDiv).empty();

    jvmMapMain = new jvm.Map({
        map: mType,
        backgroundColor: background,
        container: $('#' + mDiv),
        onMarkerTipShow: function(e, label, index) {
            var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
            label.html(finalTooltip);
        },
        onRegionTipShow: function(e, countryName, code) {
            // code contains the code of the country (i.e., PT, ES, FR, etc)
            // show the Count associated to that Country - look for the country
            var selectedCountry = -1;
            $.each(jsonCountries, function(index, currentCountry) {
                if (currentCountry.Country === code) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            if (selectedCountry != -1) {
                var finalTooltip = buildCountryTooltip(countryName, selectedCountry);
                countryName.html(finalTooltip);
            } else
                countryName.html(countryName.html());
        },
        series: {
            markers: [{
                // change the scale to fit the current min and max values
                scale: [minColorMap, maxColorMap],
                values: [minCount, maxCount],
                legend: {
                    vertical: true
                }
            }],
            regions: [{
                // min and max values of count
                scale: [minColorMap, maxColorMap],
                attribute: 'fill',
                // the colors are 'stretched' to fill the scale
                values: colors
            }]
        }
    });
}

// Auxiliary function to transpose a value from an initial range to another range
function mapRange(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function addMarkersToMultiMap(jsonMarkers) {
    availableMaps = maps.maps;
    $.each(jsonMarkers, function(index, currentMarker) {
        // the marker must be added to all the existing maps
        for (var key in availableMaps) {
            //console.log(availableMaps[key]);
            // add a marker to every map
            maps.maps[key].addMarker(index, {
                latLng: [currentMarker.Latitude, currentMarker.Longitude],
                name: currentMarker.desc,
                // set the style for this marker
                style: {
                    fill: 'green',
                    r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
                }
            });
        }
    });
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
                addMarkersToMap(jsonMarkers);
            }
        });
    });
}
