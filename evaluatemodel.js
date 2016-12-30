const parseTree = require('./parsetree.js').parseTree;
const readFile = require('./readfile.js');

const evaluateModel = (model, extract, data) => {
    var guesses = 0;
    var correctGuesses = 0;
    data.forEach(row => {
        const prediction = model(row);
        if(prediction.output == extract(row)) {
            correctGuesses++;
        }
        guesses++;
    });
    console.log('model accuracy is: ', correctGuesses / guesses);
}

const modelPath = './test/abalone_model.json';
const model = parseTree(JSON.parse(require(modelPath)));

const dataPath = 'datasets/abalone/abalone_evaluate.csv';
readFile(dataPath, data => evaluateModel(model, x => x.Rings, data));
