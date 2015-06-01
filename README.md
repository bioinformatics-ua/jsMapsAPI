# jvectormap

[jvectormap](http://jvectormap.com/) offers many maps, including world and Europe maps and some countries maps. These maps are stored as js files and are then loaded on the HTML. By using the [python converter](http://jvectormap.com/documentation/gis-converter/) it's easy to create custom maps from public map data repositories such as [Natural Earth](http://www.naturalearthdata.com/).


The _index.html_ page displays a world map and makes use of the jvectormap lib. This map is created and several markers are drawn on top of it. These markers are currently placed at random positions and their radius is specified on the input JSON. By reading the input JSON we mark on the map the countries with a color code.
There are also some filters that can be used to filter the information displayed on the map.

## vector-map

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

## Countries 

Countries appear on the map with different colours according to the Count attribute associated with them.


## Markers

Markers are used to convey information on a map. Some attributes about them can be specified like the radius, fill color, label associated with them, hover and click callback, etc.


## JSON files for input

JSON files are used to feed information to the vector-map component. They need to follow a certain format that is specified in the /json section



