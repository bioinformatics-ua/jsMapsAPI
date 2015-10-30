# jsMapsAPI

Javascript API that makes use of [jvectormap](http://jvectormap.com/)  to create a map that displays data related to countries, their regions and specific places (markers). The user defines the data he wants to visualize in a certain format and it is displayed on the kind of map he chooses (World, Europe, USA, etc) with the possibility of adding custom tooltips to be shown when a country, region or marker is hovered. Data can be filtered by any field specified by the user.

## How to use the API

To use the API you need to follow the next steps:

1. Install every dependency through bower (bower install)
2. Link to the bower_components generated on the previous steps
3. Link to the **jsMapsAPI.min.js**
4. Include the maps you want to use (further documentation on the _Supported maps_ section)
5. Import all the files on the **custom-elements folder**
6. Specifty the tooltips for the countris and the other markers (to see an explained example go to the _Tooltips_ section)

Now that you have done the previous steps, you are ready to display a map on your page. You just have to include the **vector-map** tag where you want to place the map component on your HTML; the tag attributes are as follows:

| Field   |      Description      |
|----------|:-------------:|
| id |  id of the map |
| map_type | map location to display. Possible values are 'world_mill_en' (world map), 'europe_mill_en' (Europe map), etc. By default the world map is displayed.  |
| min_color | color that represents the country with lowest Count |
|      max_color    |       color that represents the country with the highest Count        |
|     min_radius     |         min radius for the markers      |
|    max_radius      |      max radius for the markers         |
|    markers      |     path to the file that contains the JSON of the countries    |
|    countries      |      path to the file that contains the JSON of the markers  |
|    folder      | location of the folder that contains the 'img' and 'tooltip-templates' sub-directories        |
|    background_color      | colour of the map background in hex format (has a default value of #666666 )        |

Here is an example:
```html
<vector-map id="my_map" map_type='world_mill_en' min_color='#2cb5d4' max_color="#153478"
min_radius=5 max_radius=15 markers='./json/markers.json' background_color="#666666"></vector-map>
```

## Markers, Countries and Regions JSON files

JSON files are used to feed information to the vector-map component. They need to follow a certain format that is specified in the **/json** section

You can use JSON files from any external source. For that you jst need to apply the following function to the _map_ object:

```javascript
vectorMap.registerTransformer(jsonLocation, countriesMappingJson, markersMappingJson)
```

- jsonLocation - location of the external JSON file containing info about countries and/or markers
- countriesMappingJson - JSON with the countries mapping
- markersMappingJson - - JSON with the markers mapping
For information regarding the format of the countriesMappingJson and markersMappingJson files please consult the /mappingJSON section.

## Supported maps

The supported maps for the API can be found on the [jvectormap site](http://jvectormap.com/maps/).
As previously mentioned, you specify your map on the __vector-map__ tag by specifying the __map_type__ attribue. Possible values are:
- world_mill_en (World - default)
- europe_mill_en (Europe)
- pt_mill_en (Portugal)
- it_mill_en (Italy)
- etc...

## Tooltips

When a country, region or marker is hovered, you get a tooltip with some kind of information relative to it. You can specify the template for this tooltip on the **country_tooltip.html**, **region_tooltip.html** and **marker_tooltip.html** files inside the **tooltip-templates** folder.

### Tooltip examples

- country_tooltip.html (country's name and count will be displayed)

```html
<div style="color:#bf2727;">
    <h3> name - count </h3>
</div>
```

- region_tooltip.html (region's name)

```html
<div style="color:#bf2727;">
    <h3> name </h3>
</div>
```

- marker_tooltip.html (marker's description, latitude and longitude are displayed)

```html
<b>desc</b>
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

| Field   |      Description     |
|----------|:------------:|
| filters | url of the json that contains information about the filters |
| type | type of filter. Supported values are checkboxes and input     |

Here is an example:
```html
<filter-box filters="json/filters.json" type="checkboxes"></filter-box>
```

This tag will create a filters-box where you will be able to filter your information. When you select _checkboxes_ as _type_ you can select the values for the filters with checkboxes; instead if you choose _input_ as _type_ you will be able to freely write the values of the filter in a text box for each filter.

### Programmatic Filters

You can programmatically filter the applied filters by invoking the _filter_ function. Here are some examples of its use:
```javascript
    filter({"Year":'2005','Gender':'F'})
```

Enumeration and range can be combined, i.e., you can use _filter({"Year":'2005-2007','Gender':'F,M'})_. In case you want to cancel all the applied filters you just use _filter('ALL','')???_.

## Example

You can consult live examples of the API in http://bioinformatics-ua.github.io/jsMapsAPI/ that show multiple applications of this API.
