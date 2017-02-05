const parseTree = require('../../src/parsetree.js').parseTree;

const evaluate = (modelname, params) => {
    const modelPath = '../../models/' + modelname + '.json';
    const model = parseTree(JSON.parse(require(modelPath)));
    const prediction = model(params);
    return prediction;
}

module.exports = evaluate;
