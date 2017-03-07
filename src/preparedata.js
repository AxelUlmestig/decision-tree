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

const getParameters = (data, targetVar) => {
    const orderedData = data
    .map(row =>
        Object.keys(row)
        .map(param => ({
            key : param,
            value : row[param]
        }))
    )
    .reduce((allRows, row) => allRows.concat(row), [])
    .filter(dataPoint => dataPoint.key != targetVar)
    .reduce((allData, dataPoint) => {
        allData[dataPoint.key] = allData[dataPoint.key] || [];
        allData[dataPoint.key].push(dataPoint.value);
        return allData;
    }, {});

    return util.mapObj(orderedData, param => param.filter(util.isUnique));
};

const getMetaData = (data, targetVar) =>
    util.mapObj(getParameters(data, targetVar), getDataType)

const getDataType = data =>
    data
    .map(getDataEntryType)
    .filter(util.isUnique)
    .reduce((mem, type) => util.max(mem, type, x => priority[x]), INT)

const getDataEntryType = data => {
    const isInt = n => Number(n) === n && n % 1 === 0
    const isFloat = n => Number(n) === n && n % 1 !== 0

    if(isInt(data)) {
        return INT;
    } else if(isFloat(data)) {
        return FLOAT;
    } else {
        return STRING;
    }
}

/*
const getFilters = (data, targetVar) =>
    data.map(y => 
        parseFilter(
            (function(x) {return x.value == y.value})
            .toString()
            .replace('y.value', y.value)
        )
    )
*/

const getFilters = (data, targetVar, metaData) => {
    metaData = metaData || getMetaData(data, targetVar);
    const parameters = getParameters(data, targetVar);
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
    for(let value = min + 1; value <= max; value++) {
        filters.push(
            (function(x) {return x[param] < value})
            .toString()
            .replace('value', value)
            .replace('[param]', '.' + param)
        );
    }
    for(let value = min; value < max; value++) {
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
    for(let value = min + stepSize; value < max - stepSize; value += stepSize) {
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
