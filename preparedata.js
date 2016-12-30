const util = require('./util.js');
const parseFilter = require('./parsetree.js').parseFilter;

const INT = 'INT'
const FLOAT = 'FLOAT'
const STRING = 'STRING'
const priority = {
    INT: 1,
    FLOAT: 2,
    STRING: 3
}

const getParameters = (data, extract) => {
    const rawParameters = data.reduce((mem, row) =>
        util.reduceObj(row, (memLocal, value, key) => {
            if(extract(row) != row[key]) {
                memLocal[key] = memLocal[key] || [];
                memLocal[key].push(value);
            }
            return memLocal;
        }, mem)
    , {});
    return util.mapObj(rawParameters, param => param.filter(util.isUnique))
}

getMetaData = (data, extract) =>
    util.mapObj(getParameters(data, extract), getDataType)

const getDataType = data =>
    data
    .map(getDataEntryType)
    .filter(util.isUnique)
    .reduce((mem, type) => util.max(mem, type, x => priority[x]), INT)

const getDataEntryType = data => {
    isInt = n => Number(n) === n && n % 1 === 0
    isFloat = n => Number(n) === n && n % 1 !== 0
    isString = n => (typeof n) === 'string'

    if(isInt(data)) {
        return INT;
    } else if(isFloat(data)) {
        return FLOAT;
    } else {
        return STRING;
    }
}

/*
const getFilters = (data, extract) =>
    data.map(y => 
        parseFilter(
            (function(x) {return x.value == y.value})
            .toString()
            .replace('y.value', y.value)
        )
    )
*/

const getFilters = (data, extract, metaData) => {
    metaData = metaData || getMetaData(data, extract);
    const parameters = getParameters(data, extract);
    return util.reduceObj(parameters, (filters, values, param) => {
        const type = metaData[param];
        const newFilters = generateFilters(type, param, values);
        return filters.concat(newFilters);
    }, []);
}

/*
const generateFilters = (type, param, values) =>
    values.map(value => 
        parseFilter(
            (function(x) {return x[param] == value})
            .toString()
            .replace('value', value)
            .replace('[param]', '.' + param)
        )
    )
    */

const generateFilters = (type, param, values) =>
    filterTypes[type](param, values)

const generateFiltersInt = (param, values) => {
    const max = values.reduce((a, b) => Math.max(a, b));
    const min = values.reduce((a, b) => Math.min(a, b));
    const filters = [];
    for(value = min + 1; value <= max; value++) {
        filters.push(
            (function(x) {return x[param] < value})
            .toString()
            .replace('value', value)
            .replace('[param]', '.' + param)
        );
    }
    for(value = min; value < max; value++) {
        filters.push(
            (function(x) {return x[param] > value}) 
            .toString()
            .replace('value', value)
            .replace('[param]', '.' + param)
        );
    }
    return filters.map(parseFilter);
}
    
const generateFiltersFloat = (param, values) => {
    const max = values.reduce((a, b) => Math.max(a, b));
    const min = values.reduce((a, b) => Math.min(a, b));
    const stepSize = (max - min) / 2;
    const filters = [];
    for(value = min + stepSize; value < max - stepSize; value += stepSize) {
        filters.push(
            (function(x) {return x[param] < value})
            .toString()
            .replace('value', value)
            .replace('[param]', '.' + param)
        );
        filters.push(
            (function(x) {return x[param] > value})
            .toString()
            .replace('value', value)
            .replace('[param]', '.' + param)
        );
    }
    return filters.map(parseFilter);
}

const generateFiltersString = (param, values) => 
    values.map(value => 
        parseFilter(
            (function(x) {return x[param] == value})
            .toString()
            .replace('value', '"' + value + '"')
            .replace('[param]', '.' + param)
        )
    )

const filterTypes = {}
filterTypes[INT] = generateFiltersInt;
filterTypes[FLOAT] = generateFiltersFloat;
filterTypes[STRING] = generateFiltersString;

module.exports = {
    getMetaData: getMetaData,
    getFilters: getFilters
}
