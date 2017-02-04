const parseTree = require('./parsetree.js').parseTree;
const readFile = require('./readfile.js');

const evaluateModel = (model, extract, data) => {
    var guesses = 0;
    var correctGuesses = 0;
    var totalError = 0;
    data.forEach(row => {
        const prediction = model(row).output;
        const actual = extract(row);
        /*
        console.log('prediction: ', prediction);
        console.log('actual: ', actual);
        console.log('');
        */
        if(prediction == actual) {
            correctGuesses++;
        }
        totalError += Math.abs(prediction - actual)
        guesses++;
    });
    return {
        accuracy: correctGuesses / guesses,
        avgError: totalError / guesses
    };
    console.log('The model accuracy is: ', correctGuesses / guesses);
    console.log('The average error is: ', totalError / guesses);
}

const modelPath = './test/abalone_model.json';
const model = parseTree(JSON.parse(require(modelPath)));

const dataPath = 'datasets/abalone/abalone_evaluate.csv';
readFile(dataPath, data => {
    const result = evaluateModel(model, x => x.Rings, data);
    console.log(result);
});
