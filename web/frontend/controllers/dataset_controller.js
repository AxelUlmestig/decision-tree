app.controller('dataset_controller', ($scope, state) => {
    $scope.upload = () => {
        const files = document.getElementById('dataset_file').files;
        if (files.length <= 0) return false

        const fr = new FileReader();

        fr.onload = e => {
            const result = JSON.parse(e.target.result);
            const formatted = JSON.stringify(result, null, 2);
            sendDataset(files[0].name, result)
        }
        fr.readAsText(files[0]);
    }
});

sendDataset = (filename, dataset) => {
    const http = new XMLHttpRequest();
    const setname = filename.match(/(.*).json$/)[1];
    const url = "/api/dataset/" + setname;
    http.open("PUT", url, true);

    http.setRequestHeader("Content-type", "application/json");

    http.onreadystatechange = () => {
        if(http.readyState == 4 && http.status == 201) {
            console.log('upload successful');
        }
    }
    http.send(JSON.stringify({'filename': filename, 'dataset': dataset}));
}
