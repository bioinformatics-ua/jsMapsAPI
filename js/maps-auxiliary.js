// redraw the map
function reloadMap(colors) {
    // get the name of the current map
    if (map.params.map == mType) {
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
                countryCode = code.toLowerCase();
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
                    if (currentCountry.country === code) {
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

function removeBackButton() {
    // erase the previous map tooltip
    $('.jvectormap-goback').remove();
}

function switchMap(newMap) {
    // this function gets called when a country on the world map is clicked
    // erase the previous map
    $('#' + mDiv).empty();
    removeTooltip();
    var regionColors = ((dataType == 'countries') ? generateColorsForTheCountries(newMap) : []);

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
                if (currentCountry.country == currentMap) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            // check if the selected region has any data inside that country
            var regionFound = false;
            var selectedRegion;
            $.each(map.regions, function(index, currentRegion) {
                if (currentRegion.name == code) {
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
            markers: [finalMarkersInMap],
            regions: [{
                // min and max values of count
                scale: [minColorMap, maxColorMap],
                attribute: 'fill',
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
        reloadMap(auxColors);
    });

    // add the markes to the map
    if (thereAreMarkers) {
        addMarkersToMap();
    }
}
