const util = require('./util');

const pmf = (data, filter) => data.filter(filter).length / data.length

const entropy = (data, extract) => {
    const extracted = data.map(extract);
    return -1 * extracted.filter(util.isUnique) 
    .map(a => {
        const p = pmf(extracted, b => b == a)
        return p * Math.log2(p);
    })
    .reduce((a, b) => a + b, 0);
}

const informationGain = (data, extract, filter) => {
    const entropyBefore = entropy(data, extract);
    const entropyAfter = entropy(data.filter(filter), extract);
    return entropyBefore - entropyAfter;
}

const getOptimalFilter = (data, extract, filters) =>
    filters.map(filter => ({
        filter: filter, 
        infoGain: informationGain(data, extract, filter)
    }))
    .reduce((pre, cur) => util.max(pre, cur, x => x.infoGain), {filter: () => true, infoGain: 0})
    .filter;

module.exports = {
    entropy: entropy,
    informationGain: informationGain,
    getOptimalFilter: getOptimalFilter
}
