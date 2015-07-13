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
---------- | :--------------------------------------------------------------------------------------------------------------------:
country       | country from where the data is related
count      | integer value
latitude      | latitude of the marker
longitude      | longitude of the marker
icon      | icon to be displayed on the place of the marker. Markers are store on the */img* folder. E.g, if you want to use the */img/blue.png* icon the *icon* value must be *blue*
attributes | in here you can specify any aditional attibute for the markers

## Filters
JSON files for the map filters must be on the following format:

```json
[{
        "name": "Gender",
        "values": [
            "F",
            "M",
            "T"
        ]
    }, {
        "name": "Year",
        "values": [
            1990,
            1991,
            1992,
            1993,
            1994,
            1995,
            1996,
            1997,
            1998,
            1999,
            2000,
            2001,
            2002,
            2003,
            2004,
            2005,
            2006,
            2007,
            2008,
            2009,
            2010,
            2011,
            2012,
            2013
        ]
}]
```

Field      | Description
---------- | :--------------------------------------------------------------------------------------------------------------------:
name       | name of the filter
values      | possible values that the filter can assume. For example, Gender can be M, F or T
