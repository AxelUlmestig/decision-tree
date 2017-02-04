document.getElementById('import').onclick = function() {
    const files = document.getElementById('selectFiles').files;
    console.log(files);
    if (files.length <= 0) {
        return false;
    }

    const fr = new FileReader();

    fr.onload = function(e) { 
        const result = JSON.parse(e.target.result);
        const formatted = JSON.stringify(result, null, 2);
        sendDataset(files[0].name, result)
    }

    fr.readAsText(files.item(0));
};

sendDataset = (filename, dataset) => {
    var http = new XMLHttpRequest();
    var url = "/api/dataset";
    http.open("POST", url, true);
    
    //http.setRequestHeader("Content-type", "text/plain");
    http.setRequestHeader("Content-type", "application/json");
    
    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            alert(http.responseText);
        }
    }
    //http.send(dataset);
    http.send(JSON.stringify({'filename': filename, 'dataset': dataset}));
}
