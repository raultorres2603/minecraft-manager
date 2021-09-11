const { ipcRenderer, BrowserWindow, BrowserView, webContents } = require('electron');

function cerrarApp() {
    ipcRenderer.send('cerrarApp');
}

ipcRenderer.on('mandarVersiones', (event, args) => {
    let versiones = args[0]
    let select = document.getElementById('selectVersiones');
    select.append(new Option("Elige una version", "Elige una version"))
    versiones.forEach((version, posVersion) => {
        select.append(new Option(version.version, version.version))
    });
})

ipcRenderer.on('comprobarVersion_ok', (event, args) => {
    let codigo = args[0];
    let version = args[1];

    switch (codigo) {
        case "error":
            ipcRenderer.send('comprobarVersionError', [version])
            break;

        default:
            break;
    }
})

function elegirVersion() {
    ipcRenderer.send('elegirVersion')
}

function cerrarError() {
    ipcRenderer.send('cerrarError')
}

function aceptarVersion(version) {
    if (version != "Elige una version") {
        ipcRenderer.send('comprobarVersion', [version])
    }
}

function volverAlMenu() {
    ipcRenderer.send('volverAlMenu')
}