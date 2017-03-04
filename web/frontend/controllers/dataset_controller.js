app.controller('dataset_controller', ($scope, $http, state) => {

    $scope.state = state;

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

    const updateDatasets = datasets => $scope.state.datasets = datasets.data;

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
            .then(updateDatasets, console.error);
        };
        fr.readAsText(files[0]);
    };
});
