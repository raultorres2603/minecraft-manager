const { ipcRenderer} = require('electron');

function cerrarApp() {
    ipcRenderer.send('cerrarApp');
}