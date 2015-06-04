// Country definition 
var Country = function(countryObject) {
    // try to read all the names and values
    var hasName = true;
    var i = 0;
    do {
        i++;
        var currentNameToCheck = 'Name' + i;
        var currentValue = 'Value' + i;
        if (countryObject[currentNameToCheck] === undefined) {
            hasName = false;
        } else {
            this[currentNameToCheck] = countryObject[currentNameToCheck];
            this[currentValue] = countryObject[currentValue];
        }
    } while (hasName)

    this.Country = countryObject.Country;
    // + is used to assure that a Number is being read
    this.Count = +countryObject.Count;
    this.Var = countryObject.Var;
    this.desc = 'abc';
};
