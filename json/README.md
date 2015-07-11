# JSON

## Countries

JSON files for the **Countries** must be on the following format:

```json
{
"countries": [
    , {
        "Count": "14.00",
        "Name2": "Gender",
        "Value2": "M",
        "Value1": "2004",
        "Name1": "YEAR",
        "Var": "Active patients",
        "Country": "FR"
    }, {
        "Count": "153.00",
        "Name2": "Gender",
        "Value2": "T",
        "Value1": "2005",
        "Name1": "YEAR",
        "Var": "Active patients",
        "Country": "PY"
    }]
}
```

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
{
    "markers": [
        {
            "Count": "31.00",
            "Name2": "Gender",
            "Value2": "T",
            "Value1": "2004",
            "Name1": "YEAR",
            "Var": "Active patients",
            "Country": "PT",
            "Latitude": 80,
            "Longitude": 21
        },
        {
            "Count": "17.00",
            "Name2": "Gender",
            "Value2": "F",
            "Value1": "2004",
            "Name1": "YEAR",
            "Var": "Active patients",
            "Country": "ES",
            "Latitude": 90,
            "Longitude": 34
        }]
    }
```

The _countries_ field is mandatory while the _markers_ is not, i.e., you must specify data related to countries but it is not necessary to give any information related to specific locations (markers) on the map.

### Fields

- Count: number of patients
- Gender: gender (M/F/T) of the patients
- Name1: first field of data. Possible values: YEAR, AGE.
- Value1: value for the first field
- Name2: second field of data. Possible values: YEAR, AGE.
- Value2: value for the second field
- Var
- Country: country from where the data is related. Must be in the _two digit ISO_ code (https://countrycode.org/)


## Filters

JSON files for the map filters must be on the following format:
```json
    {
        "values": [{
            "comparable": false,
            "comparable_values": null,
            "key": null,
            "name": "Gender",
            "show": true,
            "translation": {
                "ALL": "Male/Female",
                "F": "Female ",
                "M": "Male"
            },
            "value": "Gender",
            "values": [
                "F",
                "M",
                "T"
            ]
        }, {
            "comparable": false,
            "comparable_values": null,
            "key": "Name1",
            "name": "YEAR",
            "show": true,
            "translation": null,
            "value": "Value1",
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
        }
    ]
}
```



## Fields

- comparable - unused
- comparable_values - unused
- key
- name - name of the filter
- show - unused
- translation - unused
- value - name of the filter on the JSON map data
- values - possible values that the filter can assume. For example, Gender can be M, F or T
