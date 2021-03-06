var FiltersBox = function(id, map, filterType) {
    this.id = id;
    this.map = map;
    this.filterType = filterType;
    
}

FiltersBox.prototype.resetFiltersBox = function() {
    var fBox = this;
    // reset all the 'fboxes'
    for (var i = 0; i < this.filters.length; i++) {
        var currentId = '#fbox' + i + '-'+fBox.map;
        $(currentId).text('');
        $(currentId).val('');
    }

    var map = findMapById(this.map);

    // reload the map
    map.filteredMarkers = map.jsonMarkers;
    map.reloadMap(map.jsonCountries);
    if(map.datatype == 'markers')
        map.addMarkersToMap();
}

FiltersBox.prototype.createFiltersBoxWithEnumeration = function() {
    var fBox = this;
    $.each(this.filters, function(index, currentFilter) {

        var filterName = currentFilter.name.toLowerCase();
        filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
        var buttonId = 'dropdown' + index + 'button';
        var ulId = 'dropdown' + index;
        var toAppend = '';

        // filter text
        toAppend += '<p><b>' + filterName + ':</b></p>';
        toAppend += '<div class="form-group">';
        toAppend += '<input type="text" class="form-control" id="fbox' + index + '-'+fBox.map+'"';

        // build the placeholder - check if we have continuous or discrete values
        if (currentFilter.continuous)
            toAppend += 'placeholder="' + currentFilter.min + '...' + currentFilter.max + '" +>';
        else
            toAppend += 'placeholder="' + currentFilter.values.join() + '" +>';
        toAppend += '</div>';

        $('#'+fBox.id).append(toAppend);

        // add Bootstrap tooltip to the filters box
        /*
        $('#'+fBox.id).tooltip({
            title: "Use this filter box to filter by multiple filters",
            placement: "bottom"
        });
        */
    });

    // add the buttons
    var textToAppend = '<button id="'+fBox.id+'_apply_filters" type="button" class="btn btn-primary col-sm-4 col-sm-offset-1">Filter</button>' +
        '<button id="'+fBox.id+'_reset_filters" type="button" class="btn btn-primary col-sm-4 col-sm-offset-1">Reset</button>';
    $('#'+fBox.id).append(textToAppend);

    // triggered when the search button is clicked
    $('#'+fBox.id+'_apply_filters').click(function() {
        // remove all the 'has-error' input boxes
        fBox.restoreInputBoxes();
        var jsonObject = {};
        var numFilters = fBox.filters.length;
        var emptyFilters = 0;
        for (var i = 0; i < numFilters; i++) {
            // current and next filter id's
            var currentFilter = '#fbox' + i + '-'+fBox.map;
            // current and next filter values
            var currentFilterValue = $(currentFilter).val();
            // check if we have any filtering to apply or not
            if (currentFilterValue !== '') {
                jsonObject[fBox.filters[i].name] = currentFilterValue;
            } else {
                emptyFilters++;
            }
        }
        // avoid the user selecting the Filter button without inputing any data
        if (emptyFilters != numFilters) {
            fBox.filter(jsonObject);
        }
    });

    // triggered when the reset button is clicked
    $('#'+fBox.id+'_reset_filters').click(function() {
        fBox.restoreInputBoxes();
        fBox.resetFiltersBox();
    });
}


FiltersBox.prototype.createFiltersBoxCheckboxes = function() {

    $('filter-box').append('<ul class="nav navbar-nav" id="filterBoxCheckboxes" style="border-style: solid; border-width: 2px;"></ul>');

    // get all the filters
    $.each(this.filters, function(index, currentFilter) {
        var boxID = '#box' + (index + 1);
        // append to the HTML
        $('#filterBoxCheckboxes').append('<li class="col-sm-6" id="box' + (index + 1) + '" class="dropdown-checkbox-example dropdown-checkbox dropdown"></li>');

        // fill the tabs for the year filter
        var tab = [];
        // check if the values are continuous or discrete
        if (currentFilter.continuous) {
            // continuous values
        } else {
            // discrete values
            $.each(currentFilter.values, function(index, currentValue) {
                tab.push({
                    'id': index + 1,
                    'label': currentValue,
                    'isChecked': false
                });
            });
        }

        function p(wat) {
            return '<p>' + JSON.stringify(wat) + '</p>';
        }

        function updateStatus() {
            var $p = $('p.status').empty();
            $p.append(p(widget.checked()));
        }

        // dropdown with checkboxes initialization
        var name = currentFilter.name.toLowerCase();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        $(boxID).dropdownCheckbox({
            data: tab,
            autosearch: true,
            hideHeader: false,
            // show number of selected items
            showNbSelected: false,
            templateButton: '<a class="dropdown-checkbox-toggle" data-toggle="dropdown" href="#">' + name + '<span class="dropdown-checkbox-nbselected"></span><b class="caret"></b>'
        });
        widget = $(boxID).data('dropdownCheckbox');

        $('body').on('change:dropdown-checkbox checked checked:all check:all uncheck:all check:checked uncheck:checked', updateStatus());
        updateStatus();
    });

    // append filter and reset button
    var textToAppend = '<div id="filters_box" class="row col-sm-12">' +
        '<button id="filter_box_apply_filters" type="button" class="btn btn-primary col-sm-4 col-sm-offset-1">Filter</button>' +
        '<button id="filter_box_reset_filters" type="button" class="btn btn-primary col-sm-4 col-sm-offset-1">Reset</button></div>';
    $('#filterBoxCheckboxes').append(textToAppend);

    // triggered when the search button is clicked
    $("#filter_box_apply_filters").click(function() {
        // remove all the 'has-error' input boxes
        restoreInputBoxes();
        var jsonObject = {};
        var numFilters = jsonFiltersArray.length;
        var emptyFilters = 0;
        for (var i = 0; i < jsonFiltersArray.length; i++) {
            // current and next filter id's
            var currentFilter = "#box" + (i + 1);
            // current filter values - selected items
            var selectedItems = getSelectedItems(currentFilter);
            var itemsArray = [];
            var keys = Object.keys(selectedItems);
            for (var j = 0; j < keys.length; j++) {
                itemsArray.push(selectedItems[keys[j]].label);
            }
            // check if we have any filtering to apply or not
            if (keys.length > 0) {
                jsonObject[jsonFiltersArray[i].name] = itemsArray.join();
            } else {
                emptyFilters++;
            }
        }
        // avoid the user selecting the Filter button without inputing any data
        if (emptyFilters != numFilters) {
            filter(jsonObject);
        }
    });

    // triggered when the reset button is clicked
    $("#filter_box_reset_filters").click(function() {
        resetFiltersBox();
    });
}
