app.controller('dataset_controller', ($scope, $http, state) => {
    const putDataset = (dataset, name) =>
        $http({
            method: 'PUT',
            url: '/api/dataset/' + name,
            data: {
                'filename': name,
                'dataset': dataset
            },
            headers: {
                'Content-type': 'application/json'
            }
        });

    const getDatasets = () =>
        $http({
            method: 'GET',
            url: '/api/dataset/',
        });

    //const updateDatasets = datasets => state.datasets = datasets;

    $scope.upload = () => {
        const files = document.getElementById('dataset_file').files;
        if (files.length <= 0) return false;

        const fr = new FileReader();

        fr.onload = e => {
            const filename = files[0].name;
            const setname = filename.match(/(.*).json$/)[1];
            const dataset = JSON.parse(e.target.result);

            putDataset(dataset, setname, console.log)
            .then(getDatasets, console.error)
            .then(console.log, console.log);
            //.then(updateDatasets, console.error);
        };
        fr.readAsText(files[0]);
    };
});
