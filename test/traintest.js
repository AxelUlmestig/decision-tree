const train = require('../train.js');
const parseTree = require('../parsetree.js').parseTree;

const data = [
    {
        value: 2.1,
        param: 'ost',
        class: 'A'
    },
    {
        value: 2.1,
        param: 'ost',
        class: 'A'
    },
    {
        value: 3,
        param: 'ost',
        class: 'B'
    },
    {
        value: 4,
        param: 'kex',
        class: 'C'
    },
    {
        value: 4,
        param: 'kex',
        class: 'C'
    },
    {
        value: 4,
        param: 'ost',
        class: 'D'
    }
]

const model = train(data, x => x.class);
console.log(model);
console.log('training done');
console.log(parseTree(model)({
    value: 4
}));
