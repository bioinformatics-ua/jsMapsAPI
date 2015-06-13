function setFilters(jsonFilters, filterType) {

	function setMenu() {
		$.each(jsonFilters, function(index, currentFilter) {
			var filterName = currentFilter.Name;

			var toAppend = '';
			toAppend += '<li>' + filterName + '<ul>';
			// add all the values from the filters
			$.each(currentFilter.Values, function(i, currentValue) {
				toAppend += '<li filter_index=' + index + '>' + currentValue + '</li>';
			});
			toAppend += '</ul></li>';
			$('#jquerymenu').append(toAppend);
		});

		// set the element to behave as a menu
		$("#jquerymenu").menu();

		// triggered when an item is selected
		$("#jquerymenu").on("menuselect", function(event, ui) {
			// selected filter
			var selectedFilter = jsonFilters[ui.item.attr('filter_index')];
			// selected value for the filter
			var filterValue = ui.item.text();
			// apply filtering
			filterFromMenuSelected(selectedFilter, filterValue);
		});
	}

	function setRadioButtons() {
		$.each(jsonFilters, function(index, currentFilter) {
			var filterName = currentFilter.Name;
			var toAppend = '';
			// add all the values from the filters
			toAppend += '<input type="radio" id="radio' + Number(index + 1) + '" name="radio">';
			toAppend += '<label for = "radio' + Number(index + 1) + '">' + filterName + ' </label>';
			$('#radioButtons').append(toAppend);
		});

		// set the element to behave as a menu
		$("#radioButtons").buttonset();

		// triggered when an item is selected
		$("#search_button").click(function() {
			// check what is on the search box
			var searchText = $('#search_text').val();
			if(searchText === '')
				alert('You must enter a search text');
			else
				console.log('searching for ' + searchText);

			// get the selected radio button

		});
	}

	switch(filterType) {
		case 'menu':
			$('#checkboxes_search').hide();
			setMenu();
			break;
		case 'radio':
			$('#jquerymenu').hide();
			setRadioButtons();
			break;
		default:
			console.log('not supported filter')
			break;
	}
}

function createFiltersBox(jsonFilters) {

	var selectedMultipleFilters = [];

	// create filters box
	$.each(jsonFilters, function(index, currentFilter) {
		var filterName = currentFilter.Name.toLowerCase();
		filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
		var buttonId = 'dropdown' + index + 'button';
		var ulId = 'dropdown' + index;
		var toAppend = '';

		// filter text
		toAppend += '<p><b>' + filterName + ':</b></p>';
		// dropdown start
		toAppend += '<div class="dropdown">';
		// dropdown button
		toAppend += '<button id=' + buttonId + ' class="btn btn-primary dropdown-toggle filter-box-dropdown" type="button" data-toggle="dropdown">Select a value<span class="caret"></span></button>';
		// dropdown items
		toAppend += '<ul id=' + ulId + ' class="dropdown-menu">';
		$.each(currentFilter.Values, function(valueIndex, element) {
			toAppend += '<li><a href="#" filterIndex=' + index + ' index=' + valueIndex + '>' + element + ' </a></li>';
		});

		toAppend += '</ul></div>';
		$('#filters_box').prepend(toAppend);

		// add on click listener
		$("#" + ulId + " li a").click(function() {
			var filterIndex = $(this).attr('filterIndex');
			var selectedIndex = $(this).attr('index');
			//console.log('Filter: '+filterIndex+'; Value: '+selectedIndex);
			$("#" + buttonId + ":first-child").text($(this).text());
			$("#" + buttonId + ":first-child").val($(this).text());
			selectedMultipleFilters[filterIndex] = jsonFilters[filterIndex].Values[selectedIndex];
		});

		// add tooltip to the filters box
		$('#filters_box').tooltip({
			title: "Use this filter box to filter by multiple filters",
			placement: "bottom"
		});
	});

	// triggered when the search button is clicked
	$("#filter_box_apply_filters").click(function() {
		if(selectedMultipleFilters.length != 0)
			applyMultipleFilters(selectedMultipleFilters, jsonFilters);
	});

	// triggered when the reset button is clicked
	$("#filter_box_reset_filters").click(function() {

		// re-render dropdowns??

		// set the dropbown button text
		$(".filter-box-dropdown").text("Select a value");
		$(".filter-box-dropdown").val('Select a value');


		// reload the map
		var colors = [];
		$.each(jsonCountries, function(index, currentCountry) {
			colors[currentCountry.Country] = currentCountry.Count;
		});
		reloadMap(colors);

		// add all the markers to the map
		$.each(jsonMarkers, function(index, currentMarker) {
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

	});
}

var resetFiltersBox = function() {
	console.log('resetting filter box (enumeration)');

	// reset all the 'fboxes'
	for(var i = 0; i < numFilters; i++) {
		$("#fbox" + i).text('');
		$("#fbox" + i).val('');
	}

	// reload the map
	var colors = generateColorsForTheCountries();
	reloadMap(colors);

	// add all the markers to the map
	$.each(jsonMarkers, function(index, currentMarker) {
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
};

function createFiltersBoxWithEnumeration(jsonFilters) {

	var numFilters = jsonFilters.length;

	// create filters box with enumeration
	$.each(jsonFilters, function(index, currentFilter) {
		var filterName = currentFilter.Name.toLowerCase();
		filterName = filterName.charAt(0).toUpperCase() + filterName.slice(1);
		var buttonId = 'dropdown' + index + 'button';
		var ulId = 'dropdown' + index;
		var toAppend = '';

		// filter text
		toAppend += '<p><b>' + filterName + ':</b></p>';
		toAppend += '<div class="form-group">';
		toAppend += '<input type="text" class="form-control" id="fbox' + index + '">';
		toAppend += '</div>';

		$('#filters_box_enumeration').prepend(toAppend);

		// add Bootstrap tooltip to the filters box
		$('#filters_box_enumeration').tooltip({
			title: "Use this filter box to filter by multiple filters",
			placement: "bottom"
		});
	});

	// triggered when the search button is clicked
	$("#filters_box_enum_apply_filters").click(function() {
		var jsonText = '{';
		for(var i = 0; i < jsonFilters.length; i++) {
			// current and next filter id's
			var currentFilter = "#fbox" + i;
			var nextFilter = "#fbox" + (i + 1);
			// current and next filter values
			var currentFilterValue = $(currentFilter).val();
			var nextFilterValue = $(nextFilter).val();
			// check if we have any filtering to apply or not
			if(currentFilterValue !== '') {
				jsonText += '"' + jsonFilters[i].Name + '": "' + currentFilterValue + '"';
				// if we have one more value and it exists, add a comma
				if(nextFilterValue !== '' && $(nextFilter).length > 0)
					jsonText += ',';
			}
		}
		jsonText += '}';
		var filtersToApply = JSON.parse(jsonText);
		multiFilter(filtersToApply);
	});

	// triggered when the reset button is clicked
	$("#filters_box_enum_reset_filters").click(function() {
		resetFiltersBox();
	});
}
