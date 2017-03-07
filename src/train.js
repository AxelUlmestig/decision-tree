const entropy = require('./entropy.js');
const prepareData = require('./preparedata.js');
const util = require('./util.js');

const ENTROPY_LIMIT = 0.2;

const train = (data, targetVar) => {
    const filters = prepareData.getFilters(data, targetVar);
    const filter = entropy.getOptimalFilter(data, targetVar, filters);
    const informationGain = entropy.informationGain(data, targetVar, filter);

    if(informationGain > ENTROPY_LIMIT) {
        const negFilter = util.negate(filter);
        const childNodePos = train(data.filter(filter), targetVar);
        const childNodeNeg = train(data.filter(negFilter), targetVar);
        return makeInternalNode(filter, childNodePos, childNodeNeg);
    } else {
        return makeLeafNode(data, targetVar);
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

const makeLeafNode = (data, targetVar) => {
    const possibleOutputs = data
    .map(dataPoint => dataPoint[targetVar])
    .reduce((mem, cur) => {
        mem[cur] = (mem[cur] || 0) + 1;
        return mem;
    }, {});

    const bestOutput = Object.keys(possibleOutputs).reduce((a, b) =>
        util.max(a, b, output => possibleOutputs[output])
    );

    return {
        output: bestOutput,
        confidence: possibleOutputs[bestOutput] / data.length,
        sampleSize: data.length
    }
}

module.exports = train
