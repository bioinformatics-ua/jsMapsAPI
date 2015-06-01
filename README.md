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

## Countries 

Countries appear on the map with different colours according to the Count attribute associated with them.


## Markers

Markers are used to convey information on a map. Some attributes about them can be specified like the radius, fill color, label associated with them, hover and click callback, etc.


## JSON files for input

JSON files are used to feed information to the vector-map component. They need to follow a certain format that is specified in the /json section

## Example

You can consult a live example of the API in ...

This page displays a world map with several countries filled with a color that conveys some kind of information. There are also maps placed on the map.
There are also some filters that can be used to filter the information displayed on the map.



