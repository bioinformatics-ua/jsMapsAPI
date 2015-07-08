// redraw the map
function reloadMap(colors) {

    // get the name of the current map
    if (map.params.map == mType) {
        console.log('main map');
        // main map
        // update min and max Count of the countries
        if (jsonCountries.length > 0)
            readMinMax(colors);

        // erase the map
        $("#" + mDiv).empty();

        map = new jvm.Map({
            map: mType,
            backgroundColor: background,
            container: $('#' + mDiv),
            onRegionClick: function(e, code) {
                // reload a new map
                countryCode = code.toLowerCase();
                // waitToAddMarkers(100);
                var newMap = countryCode + '_mill_en';
                // swith to new map
                switchMap(newMap);
            },
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

    } else {
        // submap
        // update min and max Count of the countries
        if (jsonCountries.length > 0)
            readMinMax(colors);

        // erase the map
        $("#" + mDiv).empty();

        map = new jvm.Map({
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
}

function removeTooltip() {
    // erase the previous map tooltip
    $('.jvectormap-tip').remove();
}

function switchMap(newMap) {
    // this function gets called when a country on the world map is clicked
    // erase the previous map
    $('#' + mDiv).empty();
    removeTooltip();

    var regionColors = generateColorsForTheRegions(newMap);

    map = new jvm.Map({
        map: newMap,
        backgroundColor: background,
        container: $('#' + mDiv),
        onMarkerTipShow: function(e, label, index) {
            var finalTooltip = buildMarkerTooltip(jsonMarkers, index);
            label.html(finalTooltip);
        },
        onRegionTipShow: function(e, regionName, code) {
            var currentMap = newMap.split('_')[0].toUpperCase()
            // code contains the code of the region (i.e., PT-1, ES-M, etc)
            // show the Count associated to that Region - look for the Region
            var selectedCountry = -1;
            // find the corresponding country
            $.each(jsonCountries, function(index, currentCountry) {
                if (currentCountry.Country ==currentMap) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            // check if the selected region has any data inside that country
            var regionFound = false;
            var selectedRegion;
            $.each(selectedCountry.Regions, function(index, currentRegion) {
                if (currentRegion.name == code) {
                    console.log('+');
                    selectedRegion = currentRegion;
                    regionFound = true;
                    return;
                }
            });
            if (regionFound) {
                regionName.html(buildRegionTooltip(selectedRegion));
            } else
                regionName.html(regionName.html());
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
                values: regionColors
            }]
        }
    });

    // add the markers
    if (thereAreMarkers) {
        console.log('there are markers');
        addMarkersToMap();
    }

    if (jsonCountries) {
        // check if the selected map has any region to highlight
        // addRegionsToMap(newMap)
    }
}

function addMarkersToMap() {
    $.each(filteredMarkers, function(index, currentMarker) {
        //console.log(availableMaps[key]);
        // add a marker to every map
        map.addMarker(index, {
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
