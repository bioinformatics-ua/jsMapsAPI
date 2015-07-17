// redraw the map
VectorialMap.prototype.reloadMap = function(colors) {
    // update min and max Count of the countries
    if (this.jsonCountries.length > 0)
        this.readMinMax(colors);

    // erase the map
    $("#" + this.mDiv).empty();

    var vMap = this;

    this.map = new jvm.Map({
        map: vMap.mType,
        backgroundColor: vMap.background,
        container: $('#' + vMap.mDiv),
        onRegionClick: function(e, code) {
            countryCode = code.toLowerCase();
            var newMap = countryCode + '_mill_en';
            // swith to new map
            vMap.switchMap(newMap);
        },
        onMarkerTipShow: function(e, label, index) {
            var finalTooltip = buildMarkerTooltip(vMap.jsonMarkers, index);
            label.html(finalTooltip);
        },
        onRegionTipShow: function(e, countryName, code) {
            // code contains the code of the country (i.e., PT, ES, FR, etc)
            // show the Count associated to that Country - look for the country
            var selectedCountry = -1;
            $.each(vMap.jsonCountries, function(index, currentCountry) {
                if (currentCountry.name === code) {
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
                scale: [vMap.minColorMap, vMap.maxColorMap],
                attribute: 'fill',
                values: colors
            }]
        }
    });

    // add the markes to the map
    if (vMap.thereAreMarkers)
        vMap.addMarkersToMap();
}

VectorialMap.prototype.removeTooltip = function() {
    // erase the previous map tooltip
    $('.jvectormap-tip').remove();
}

function removeBackButton() {
    // erase the previous map tooltip
    $('.jvectormap-goback').remove();
}

VectorialMap.prototype.switchMap = function(newMap) {
    // this function gets called when a country on the world map is clicked
    // erase the previous map
    $('#' + this.mDiv).empty();
    this.removeTooltip();
    var regionColors = ((dataType == 'countries') ? this.generateColorsForTheCountries(this.jsonCountries) : []);
    var vMap = this;

    this.map = new jvm.Map({
        map: newMap,
        backgroundColor: vMap.background,
        container: $('#' + vMap.mDiv),
        onMarkerTipShow: function(e, label, index) {
            var finalTooltip = buildMarkerTooltip(vMap.jsonMarkers, index);
            label.html(finalTooltip);
        },
        onRegionTipShow: function(e, regionName, code) {
            var currentMap = newMap.split('_')[0].toUpperCase()
                // code contains the code of the region (i.e., PT-1, ES-M, etc)
                // show the Count associated to that Region - look for the Region
            var selectedCountry = -1;
            // find the corresponding country
            $.each(vMap.jsonCountries, function(index, currentCountry) {
                if (currentCountry.country == currentMap) {
                    selectedCountry = currentCountry;
                    return;
                }
            });
            // check if the selected region has any data inside that country
            var regionFound = false;
            var selectedRegion;
            $.each(vMap.map.regions, function(index, currentRegion) {
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
                scale: [vMap.minColorMap, vMap.maxColorMap],
                attribute: 'fill',
                values: regionColors
            }]
        }
    });

    // add back button
    $('#my_map').append('<div class="jvectormap-goback">Back</div>');
    $(".jvectormap-goback").click(function() {
        // erase the previous map
        $('#' + this.mDiv).empty();
        vMap.removeTooltip();
        vMap.reloadMap(vMap.auxColors);
    });

    // add the markes to the map
    if (this.thereAreMarkers) {
        this.addMarkersToMap(this.filteredMarkers);
    }
}
