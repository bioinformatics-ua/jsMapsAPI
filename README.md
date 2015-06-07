# jsMapsAPI

Javascript API that makes use of the [jvectormap](http://jvectormap.com/) lib to create a world map to display data related to countries and other places.

## How to use the API

To display a map on a webpage just include the **vector-map** tag in your HTML with the following attributes:

- id = "map" 
- min_color - color that represents the country with lowest Count
- max_color - color that represents the country with the highest Count
- min_radius - min radius for the markers
- max_radius - max radius for the markers
- filters - path to the file/page that contains the JSON of the map filters
- markers - path to the file/page that contains the JSON of the countries (and markers if present)

Here is an example:

    <vector-map id="map" min_color='#ffffff' max_color="#000000" min_radius=2 max_radius=8 filters='json/filters.json' markers='json/countries.json'></vector-map>

## Filters

Filters are used on the markers to better select the information to be consulted. For example, we can view information related only to a certain year or a certain gender.

You can filter the information shown on the map by using the **vector-map-filters** tag in your HTML file with the following attributes:

- id="filters"
- filters - url of the json that contains information about the filters
- filter_type - type of filter. Supported values are _menu_ and _radio_

Here is an example:

    <vector-map-filters id="filters" filters="json/filters.json" filter_type="menu"></vector-map-filters>

### Multiple filters at the same time

Many filters can be applied on the map by using a custom _filters box_ that can be added to a page using the **filters-box** tag with the following attributes:

- id="filters-box"
- filters - url of the json that contains information about the filters

Here is an example:
    
    <filters-box id="filters-box" filters="json/filters.json"></filters-box>


### Programmatic Filters

You can programmatically filter the applied filters by invoking the _filter_ function. Here are some examples of its use:

    filter('YEAR','2005-2007') // range
    filter('YEAR','2003,2004,2005') // enumeration

Enumeration and range can be combined, i.e., you can use _filter('YEAR','2003,2004-2008')_. In case you want to cancel all the applied filters you just use _filter('ALL','')_.

In case you want to apply multiple filters you use the _multiFilter_ function:

    multiFilter({"Year":'2005','Gender':'F'})


## Countries 

Countries appear on the map with different colours according to the Count attribute associated with them.


## Markers

Markers are used to convey information on a map. Some attributes about them can be specified like the radius, fill color, label associated with them, hover and click callback, etc.


## JSON files for input

JSON files are used to feed information to the vector-map component. They need to follow a certain format that is specified in the /json section

## Example

You can consult a live example of the API in http://bioinformatics-ua.github.io/jsMapsAPI/.

This page displays a world map with several countries filled with a color that conveys some kind of information. There are also maps placed on the map.
There are also some filters that can be used to filter the information displayed on the map.



