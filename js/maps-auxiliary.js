// redraw the map
function reloadMap(colors) {
    // get the name of the current map
    if (map.params.map == mType) {
        // main map
        // update min and max Count of the countries
        if (jsonCountries.length > 0)
            readMinMax(colors);

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
            scale: [minColorMap, maxColorMap],
            // range of values associated with the Count
            values: [minCount, maxCount]
        };

        finalMarkersInMap = markersWithLegend;
        if (dataType == 'markers') {
            finalMarkersInMap = markersWithoutLegend;
        }

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
                markers: [finalMarkersInMap],
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
        removeTooltip();
        switchMap(mapType);
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
                if (currentCountry.Country == currentMap) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            // check if the selected region has any data inside that country
            var regionFound = false;
            var selectedRegion;
            $.each(map.regions, function(index, currentRegion) {
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

    // add back button
    $('#my_map').append('<div class="jvectormap-goback">Back</div>');
    $(".jvectormap-goback").click(function() {
        // erase the previous map
        $('#' + mDiv).empty();
        removeTooltip();
        // when the left button is clicked
        // return to the main map
        map = new jvm.Map({
            container: $('#' + mDiv),
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
        });

        // add the markes to the map
        if (thereAreMarkers) {
            addMarkersToMap();
        }
    });

    // add the markers
    if (thereAreMarkers) {
        addMarkersToMap();
    }

    if (jsonCountries) {
        // check if the selected map has any region to highlight
        // addRegionsToMap(newMap)
    }
}

function addMarkersToMap() {
    var markersJSONArray = [];
    $.each(filteredMarkers, function(index, currentMarker) {
        var currentMarkerJSON = {
            latLng: [currentMarker.Latitude, currentMarker.Longitude],
            name: currentMarker.desc,
            // set the style for this marker
            style: {
                fill: 'green',
                r: mapRange(currentMarker.Count, minCount, maxCount, minRadius, maxRadius)
            }
        };
        markersJSONArray.push(currentMarkerJSON);
    });
    map.addMarkers(markersJSONArray);
}
