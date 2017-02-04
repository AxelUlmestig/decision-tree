const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const trainmodel = require('./server/trainmodel.js');

const app = express();
app.use(express.static(__dirname + '/'));
app.set('views', __dirname + '/');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('frontend/index.html');
});

app.post('/api/dataset', (req, res) => {
    const filename = req.body.filename;
    const data = req.body.dataset;
    fs.writeFile('../datasets/' + filename, JSON.stringify(data), err => {
        res.status(201);
        res.send();
    });
});

app.post('/api/train', (req, res) => {
    const dataset = req.body.dataset;
    const targetvar = req.body.targetvar;
    //TODO make path relative to app.js, not readdata file
    trainmodel('../../datasets/' + dataset, '../models', targetvar);
    //trainmodel('../datasets/' + dataset, '../models', targetvar);

    res.status(201);
    res.send();
})

app.listen(8080, () => {
    console.log('server starting');
});
