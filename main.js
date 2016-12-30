const entropy = require('./entropy.js');
const prepareData = require('./preparedata.js');
const util = require('./util.js');

const ENTROPY_LIMIT = 0.5;

const train = (data, extract) => {
    const filters = prepareData.getFilters(data, extract);
    const filter = entropy.getOptimalFilter(data, extract, filters);
    const informationGain = entropy.informationGain(data, extract, filter);

    if(informationGain > ENTROPY_LIMIT) {
        const negFilter = util.negate(filter);
        const childNodePos = train(data.filter(filter), extract);
        const childNodeNeg = train(data.filter(negFilter), extract);
        return makeInternalNode(filter, childNodePos, childNodeNeg);
    } else {
        return makeLeafNode(data, extract);
    }
}

const stringifyFunction = f =>
    f.toString().replace(/anonymous|\n|\/\*\*\//g, '')

const makeInternalNode = (filter, posChild, negChild) => 
    ({
        filter: stringifyFunction(filter),
        posChild: posChild,
        negChild: negChild
    })

const makeLeafNode = (data, extract) => {
    const possibleOutputs = data.map(extract)
    .reduce((mem, cur) => {
        mem[cur] = (mem[cur] || 0) + 1;
        return mem;
    }, {});

    const bestOutput = Object.keys(possibleOutputs).reduce((a, b) =>
        util.max(a, b, output => possibleOutputs[output])
    );

    return {
        output: bestOutput,
        confidence: possibleOutputs[bestOutput] / data.length
    }
}

module.exports = {
    train: train
}
