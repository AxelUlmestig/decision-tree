const fs = require('fs');
const readdata = require('./readfile.js');
const train = require('../../src/train.js');

const trainmodel = (datapath, modeldir, variable) =>
    new Promise((resolve, reject) =>
            readdata(datapath, data => {
                const fileinfo = /(.*\/)(.*)\.(.+)$/g.exec(datapath);
                const filename = fileinfo[2];
                const modelfilename = filename + '_' + variable + '.json';

                const model = train(data, x => x[variable]);

                fs.writeFile(modeldir + '/' + modelfilename, JSON.stringify(JSON.stringify(model), null, 4));
                resolve(modelfilename);
        })
    )

module.exports = trainmodel;
