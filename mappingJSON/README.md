# JSON mapping

If you want to apply server-side filtering, i.e, get countries and markers from an external data source you must establish the mapping between the format used by that external source and the one used by jsMapsAPI.

To do that, simply edit the _mappingCountries.json_ and _mappingMarkers.json_ files on the _mappingJSON_ folder. For every key of the markers and countries you must specify what is the equivalent key on the external source.


Here's a sample for the markers

	{
		"Country": "country",
		"Count": "number",
		"Name1": "ano",
		"Name2": "gender",
		"Latitude": "latitude",
		"Longitude": "longitude"
	}

In this example, the **number** field of the external source corresponds to the **Count** field of the API. For a list of the required fields go to https://github.com/bioinformatics-ua/jsMapsAPI/tree/dev/json.
