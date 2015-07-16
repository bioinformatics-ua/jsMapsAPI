# JSON
## Countries
JSON files for the **Countries** must be on the following format:

```json
[{
    "count": "31.00",
    "name": "PT",
    "attributes": {
        "gender": "T",
        "year": "2004"
    }
}, {
    "count": "17.00",
    "name": "ES",
    "attributes": {
        "gender": "M",
        "year": "2004"
    }
}]
```

Field      | Description
---------- | :--------------------------------------------------------------------------------------------------------------------:
name       | name of the country. This must be on the [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format
count      | integer that conveys any kind of information and acts as the main field of each country
attributes | in here you can specify any aditional attibute for the countries

### Regions
If you want, you can specify information relative to **Regions** inside a certain country. Here's an example:

```json
{
    "countries": [{
        "Count": "31.00",
        "Name2": "Gender",
        "Value2": "T",
        "Value1": "2004",
        "Name1": "YEAR",
        "Var": "Active patients",
        "Country": "PT"
    }, {
        "Count": "17.00",
        "Name2": "Gender",
        "Value2": "F",
        "Value1": "2004",
        "Name1": "YEAR",
        "Var": "Active patients",
        "Country": "ES",
        "Regions": [{
            "name": "ES-SE"
        }, {
            "name": "ES-M"
        }]
    }]
}
```

## Markers
JSON files for the **Markers** must be in the following format:

```json
[{
    "count": "153.00",
    "attributes": {
        "gender" : "T",
        "year" : "2005"
    },
    "country": "PY",
    "latitude": 40,
    "longitude": 25,
    "icon": "red"
}, {
    "count": "80.00",
    "attributes": {
        "gender" : "M",
        "year" : "2005"
    },
    "country": "RU",
    "latitude": -20,
    "longitude": 21,
    "icon": "blue"
}]
```

Field      | Description
---------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------:
country    | country from where the data is related
count      | integer value
latitude   | latitude of the marker
longitude  | longitude of the marker
icon       | icon to be displayed on the place of the marker. Markers are store on the */img* folder. E.g, if you want to use the */img/blue.png* icon the *icon* value must be *blue*
attributes | in here you can specify any aditional attibute for the markers

## Filters
JSON files for the map filters must be on the following format:

```json
[{
    "continuous": "false",
    "values": ["M", "F", "T"],
    "name": "gender"
}, {
    "continuous": "false",
    "values": [2010, 2011, 2012, 2013],
    "name": "year"
}, {
    "name": "height",
    "continuous": "true",
    "min": 100,
    "max": 200
}, {
    "max": 200,
    "continuous": "true",
    "name": "weight",
    "min": 20
}]
```

Field  | Description
------ | :------------------------------------------------------------------------------:
name   | name of the filter
values | possible values that the filter can assume. For example, Gender can be M, F or T
continuous   | variable indicating weather the values the filter can assume are discrete (e.g. the gender) or are continuos (e.g. the height or weight). In case the values are discrete, the possible values are read from the "values" attribute, if they are continuous two extra fields ('min' and 'max') define, as their name indicates, the mininum and maximum values for the filter
min   | minimum value the filter can assume
max   | maximum value the filter can assume
