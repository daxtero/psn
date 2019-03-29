const {ipcRenderer} = require('electron');
const PsnParser = require('./PsnParser');

function queryPsn(queryString) {
    let results = ipcRenderer.sendSync('query', queryString);
    let parser = new PsnParser();

    let result = document.getElementById('result');
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }

    parser.parse(results).getEntries().forEach(function (entry) {
        let newNode = entry.asDomNode();
        result.appendChild(newNode);
    })

}
