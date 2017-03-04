const fs = require('fs');

const getMetaData = (datasetsDir, datasetName) => {
    if(!datasetName) return getAllMetaData(datasetsDir);

    const fileContent = fs.readFileSync(datasetsDir + datasetName + '.json');
    const row0 = JSON.parse(fileContent)[0];
    const parameters = Object.keys(row0);

    return {
        dataset: datasetName,
        parameters: parameters
    };
};

const getAllMetaData = datasetsDir =>
    fs
    .readdirSync(datasetsDir)
    .filter(filename => /(?:\.([^.]+))?$/.exec(filename)[1] == 'json')
    .map(filename => filename.slice(0, -5))
    .map(datasetName => getMetaData(datasetsDir, datasetName));


module.exports = getMetaData;
