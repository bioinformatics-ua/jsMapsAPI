# jsMapsAPI

Javascript API that makes use of the [jvectormap](http://jvectormap.com/) lib to create a world map to display data related to countries and other places.

## Countries

Countries appear on the map with different colours according to the Count attribute associated with them.


## Markers

Markers are used to convey information on a map. Some attributes about them can be specified like the radius, fill color, label associated with them, hover and click callback, etc.

## How to use the API

To display a map on a webpage just include the **vector-map** tag in your HTML with the following attributes:

- id - "map"
- map_type - map location to display. Possible values are 'world_mill_en' (world map), 'europe_mill_en' (Europe map), etc. By default the world map is displayed. Available maps can be found [here](http://jvectormap.com/maps/), with the possibility of creating your own maps with the tools available in [jvectormap](http://jvectormap.com/documentation/gis-converter/)
- min_color - color that represents the country with lowest Count
- max_color - color that represents the country with the highest Count
- min_radius - min radius for the markers
- max_radius - max radius for the markers
- filters - path to the file/page that contains the JSON of the map filters
- markers - path to the file/page that contains the JSON of the countries (and markers if present)

Here is an example:

    <vector-map id="map" map_type='world_mill_en' min_color='#ffffff' max_color="#000000" min_radius=2 max_radius=8 filters='json/filters.json' markers='json/countries.json'></vector-map>

## Supported maps

The supported maps for the API can be found on the [jvectormap site](http://jvectormap.com/maps/). In order to use a map you must add a script tag which imports the map you want to use, i.e., in case you which to use the world map you must add a script tag similar to the next on your file:
    <script src="path/to/maps/folder/world-mill-en.js"></script>
There is the possibility to use the Miller(_world-mill-en_) or Mercator(_world-merc-en_) projection, it's up to you to choose which one suits you the best.

As previously mentioned, you specify your map on the __vector-map__ tag by specifying the __map_type__ attribue. Possible values are:
- world_mill_en (World - default)
- europe_mill_en (Europe)
- pt_mill_en (Portugal)
- it_mill_en (Italy)
- etc...

Please pay attention to the use of underscores delimiting the words. To switch from the Miller to the Mercator projection just replace __mill__ with __merc__.

There is also the possibility for you to create your own maps and use them with this API; all the required steps are described in [jvectormap documentation](http://jvectormap.com/documentation/gis-converter/).

## Tooltips

When a country or a marker is hovered, you get a tooltip with some kind of information relative to it. You can specify the template for this tooltip on the **country_tooltip.html** and **marker_tooltip.html** files inside the **tooltip-templates** folder.

### Tooltip examples

- country_tooltip.html (country's name and count will be displayed)
```html
<div style="color:#bf2727;">
    <h3>
        name - count </h3>
</div>
```

- marker_tooltip.html (marker's description, latitude and longitude are displayed)

```html
<b>description</b>
<br>

<b>Latitude:
</b> latitude

<br>

<b>Longitude:
</b> longitude
```


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

    filter({"Year":'2005','Gender':'F'})

Enumeration and range can be combined, i.e., you can use _filter({"Year":'2005-2007','Gender':'F,M'})_. In case you want to cancel all the applied filters you just use _filter('ALL','')???_.



## JSON files for input

JSON files are used to feed information to the vector-map component. They need to follow a certain format that is specified in the /json section

You can use JSON files from any external source. For that you jst need to apply the following function to the _map_ object:

    vectorMap.registerTransformer(jsonLocation, countriesMappingJson, markersMappingJson)

- jsonLocation - location of the external JSON file containing info about countries and/or markers
- countriesMappingJson - JSON with the countries mapping
- markersMappingJson - - JSON with the markers mapping
For information regarding the format of the countriesMappingJson and markersMappingJson files please consult the /mappingJSON section.


## Example

You can consult a live example of the API in http://bioinformatics-ua.github.io/jsMapsAPI/.

This page displays a world map with several countries filled with a color that conveys some kind of information. There are also maps placed on the map.
There are also some filters that can be used to filter the information displayed on the map.
