const util = require('./util');

const pmf = (data, filter) => data.filter(filter).length / data.length

const entropy = (data, targetVar) => {
    const targetVarValues = data.map(dataPoint => dataPoint[targetVar]);
    return -1 * targetVarValues.filter(util.isUnique)
    .map(a => {
        const p = pmf(targetVarValues, b => b == a)
        return p * Math.log2(p);
    })
    .reduce((a, b) => a + b, 0);
}

const informationGain = (data, targetVar, filter) => {
    const entropyBefore = entropy(data, targetVar);
    const entropyAfter = entropy(data.filter(filter), targetVar);
    return entropyBefore - entropyAfter;
}

const getOptimalFilter = (data, targetVar, filters) =>
    filters.map(filter => ({
        filter: filter,
        infoGain: informationGain(data, targetVar, filter)
    }))
    .reduce((pre, cur) => util.max(pre, cur, x => x.infoGain), {filter: () => true, infoGain: 0})
    .filter;

module.exports = {
    entropy: entropy,
    informationGain: informationGain,
    getOptimalFilter: getOptimalFilter
}
