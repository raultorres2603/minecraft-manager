const { ipcRenderer, BrowserWindow, BrowserView, webContents } = require('electron');
var $ = require('jquery');

// Auto updater
const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});

ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

ipcRenderer.on('restart_app', () => {
    autoUpdater.quitAndInstall();
  });

function closeNotification() {
    notification.classList.add('hidden');
}
function restartApp() {
    ipcRenderer.send('restart_app');
}

//////////////////////////////////////////

function cerrarApp() {
    ipcRenderer.send('cerrarApp');
}

function cerrarErrorModsExtension() {
    ipcRenderer.send('cerrarErrorModsExtension');
}

ipcRenderer.on('errorFileMod', (event, args) => {
    let file = args[0];
    $('#fileError').text(`${file}`)
})

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

ipcRenderer.on('filesDirectorioMods', (event, args) => {
    let files = args[0];
    let filesModsInstaller = args[1];
    let select = document.getElementById('selectFiles');
    let selectFilesInstalled = document.getElementById('selectFilesInstalled');

    var i, L = select.options.length - 1;
    for (i = L; i >= 0; i--) {
        select.remove(i);
    }

    var i1, L1 = selectFilesInstalled.options.length - 1;
    for (i1 = L1; i1 >= 0; i1--) {
        selectFilesInstalled.remove(i1);
    }

    files.forEach(file => {
        select.append(new Option(file, file));
    });

    filesModsInstaller.forEach(fileMod => {
        selectFilesInstalled.append(new Option(fileMod, fileMod));
    });

})

ipcRenderer.on('versionInstalarMods', (event, args) => {
    let version = args[0];
    let files = args[1];
    let filesModsInstaller = args[2];
    document.getElementById('version').textContent = `Version: ${version}`;

    let select = document.getElementById('selectFiles');
    let selectFilesInstalled = document.getElementById('selectFilesInstalled');

    var i, L = select.options.length - 1;
    for (i = L; i >= 0; i--) {
        select.remove(i);
    }

    var i1, L1 = selectFilesInstalled.options.length - 1;
    for (i1 = L1; i1 >= 0; i1--) {
        selectFilesInstalled.remove(i1);
    }

    files.forEach(file => {
        select.append(new Option(file, file));
    });

    filesModsInstaller.forEach(fileMod => {
        selectFilesInstalled.append(new Option(fileMod, fileMod));
    });

    setInterval(() => {
        ipcRenderer.send('leerDirectorioMods')
    }, 10000)
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

function installMods(files) {
    if (files) {
        ipcRenderer.send('installMods', [files]);
    }
}

function removeMods(files) {
    if (files) {
        ipcRenderer.send('removeMods', [files]);
    }
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