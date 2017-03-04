const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const getmetadata = require('./server/getmetadata.js');
const trainmodel = require('./server/trainmodel.js');
const evaluate = require('./server/evaluate.js');

const DATASETS_PATH = 'datasets/';
const MODELS_PATH = 'models/';

const app = express();
app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('frontend/index.html');
});

app.put('/api/dataset/*', (req, res) => {
    const regex = /\/api\/dataset\/(.*)$/
    const datasetname = req.url.match(regex)[1];
    const filename = datasetname + '.json';
    const data = req.body.dataset;
    fs.writeFile(DATASETS_PATH + filename, JSON.stringify(data), err => {
        res.status(201);
        res.send();
    });
})

app.get('/api/dataset*', (req, res) => {
    const regex = /\/api\/dataset\/(.*)$/
    const match = req.url.match(regex);
    const datasetname = match ? match[1] : undefined;

    try {
        const metadata = getmetadata(DATASETS_PATH, datasetname);
        res.send(metadata);
    } catch(e) {
        console.error(e);
        res.status(404);
        res.send({ 'error' : datasetname + ' not found' });
    }
});

app.post('/api/dataset/*/train', (req, res) => {
    const regex = /\/api\/dataset\/(.*)\/train$/
    const datasetname = req.url.match(regex)[1];
    const targetvar = req.body.targetvar;
    const path = DATASETS_PATH + datasetname + '.json';

    trainmodel(path, MODELS_PATH, targetvar)
    .then(modelname => {
        res.status(201);
        res.send(modelname);
    })
    .catch(err => {
        res.status(400);
        res.send(err);
    });
})

app.post('/api/model/*/evaluate', (req, res) => {
    const regex = /\/api\/model\/(.*)\/evaluate$/
    const model = req.url.match(regex)[1];
    const params = req.body.params;
    const result = evaluate(model, params);

    res.send(result);
});

app.listen(8080, () => {
    console.log('server starting');
});
