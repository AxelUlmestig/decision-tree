const csv = require('csvtojson')
const fs = require('fs');

const readFile = (path, cb) => {
    const fileExtension = path.match(/\.([a-z]+)$/)[1];
    if(fileExtension == 'json') {
        fs.readFile(path, 'utf8', cb);
    } else if(fileExtension == 'csv') {
        const output = [];
        csv()
        .fromFile(path)
        .on('data', (data) => {
            const row = JSON.parse(data.toString("utf8"));
            output.push(row);
        })
        .on('end', () => {
            cb(output);
        })
    } else {
        throw fileExtension + ' is not a supported file extension';
    }
}

module.exports = readFile
