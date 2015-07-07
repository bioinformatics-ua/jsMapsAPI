var Region = function(regionObject, country) {
    // read from the input parameters
    this.Region = regionObject.name;
    this.Country = country;
    // + is used to assure that a Number is being read
    this.desc = 'just a region...';
    console.log(this);
};

function readRegionsFromJSON(regions, country) {
	var regionsArr = [];
	$.each(regions, function(index, currentRegion) {
		regionsArr[index] = new Region(currentRegion, country);
	});
	return regions;
}
