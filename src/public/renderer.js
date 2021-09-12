const { ipcRenderer, BrowserWindow, BrowserView, webContents } = require('electron');

function cerrarApp() {
    ipcRenderer.send('cerrarApp');
}

ipcRenderer.on('mandarVersiones', (event, args) => {
    let versiones = args[0]
    let select = document.getElementById('selectVersiones');
    select.append(new Option("Choose a version", "Choose a version"))
    versiones.forEach((version, posVersion) => {
        select.append(new Option(version.version, version.version))
    });
})

ipcRenderer.on('versionForge', (event, args) => {
    let version = args[0];
    let paragraph = document.getElementById('versionForge').textContent = `Do you want to install the ${version} forge?`
})

ipcRenderer.on('versionInstalarMods', (event, args) => {
    let version = args[0];
    let files = args[1];
    document.getElementById('version').textContent = `Version: ${version}`
    files.forEach(file => {
        
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

function cerrarInstalarMods() {
    ipcRenderer.send('cerrarInstalarMods')
}

function cerrarCarpetaModsError() {
    ipcRenderer.send('cerrarCarpetaModsError')
}

function elegirVersion() {
    ipcRenderer.send('elegirVersion')
}

function instalarForge() {
    ipcRenderer.send('instalarForge');
}

function cerrarErrorForge() {
    ipcRenderer.send('cerrarErrorForge')
}

function cerrarErrorForgeDesc() {
    ipcRenderer.send('cerrarErrorForgeDesc')
}

function cerrarError() {
    ipcRenderer.send('cerrarError')
}

function aceptarVersion(version) {
    if (version != "Choose a version") {
        ipcRenderer.send('comprobarVersion', [version])
    }
}

function volverAlMenu() {
    ipcRenderer.send('volverAlMenu')
}