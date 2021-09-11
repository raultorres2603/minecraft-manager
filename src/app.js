const { app, BrowserWindow, ipcMain, Menu, globalShortcut, webContents } = require('electron')
const path = require('path')
const fs = require('fs');
const os = require('os');
const url = require('url');
const https = require('https');
const { exec, spawn, execFile } = require('child_process');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
});

var mainWindow;
var versiones = require("./public/versiones/versiones.json");
var versionWindow;
var forgeErrorWindow;
var forgeErrorDescWindow;
var currentVersion;

ipcMain.on('cerrarApp', (event, args) => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('cerrarErrorForge', (event, args) => {
  forgeErrorWindow.close();
})

ipcMain.on('volverAlMenu', () => {
  mainWindow.loadFile(__dirname + "/../views/menu.html");
})

ipcMain.on('comprobarVersionError', (event, args) => {
  createErrorVersion()
})

ipcMain.on('cerrarError', (event, args) => {
  versionWindow.close()
})

ipcMain.on('cerrarErrorForgeDesc', (event, args) => {
  forgeErrorDescWindow.close();
})

ipcMain.on('instalarForge', (event, args) => {
  versiones.forEach((elemento, posVersiones) => {
    if (elemento.version == currentVersion) {
      https.get(elemento.forge, { encoding: null }, (res) => {
        res.on('error', (err) => {
          return errorDescargarForge(currentVersion);
        })

        let fichero = fs.createWriteStream(path.join(os.homedir(), "Downloads", `forge-${currentVersion}.jar`));
        res.pipe(fichero)

        res.on(`end`, () => {
          exec(`java -jar ${path.join(os.homedir(), "Downloads", `forge-${currentVersion}.jar`)}`, (err, stdout, stderr) => {
            if (err) {
              console.log(err)
            }
            if (stdout) {
              fs.unlink(`${path.join(os.homedir(), "Downloads", `forge-${currentVersion}.jar`)}`, (err) => {
                if (err) {
                  console.log(err)
                  forgeErrorWindow.close();
                } else {
                  forgeErrorWindow.close();
                }
              });
            }
          })
        })
      })
    }
  });
})

ipcMain.on('comprobarVersion', (event, args) => {
  let version = args[0];
  fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "versions", version), (err, files) => {
    if (err) {
      event.sender.send('comprobarVersion_ok', ["error", version])
    } else {
      versiones.forEach(elemento => {
        if (elemento.version == version) {
          let forgeDirectory = elemento.forge.indexOf(`/forge/`);
          let lastBarra = elemento.forge.lastIndexOf('/');
          let directorioVersion = elemento.forge.substring(forgeDirectory + 7, lastBarra)
          let versionString = directorioVersion.substring(0, directorioVersion.indexOf("-"))
          let numeritos = directorioVersion.substring(directorioVersion.indexOf("-"), directorioVersion.length);
          let carpetaVersion = `${versionString}-forge${numeritos}`

          fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "versions", carpetaVersion), (err, files) => {
            if (err) {
              currentVersion = version
              createForgeError(version)
            } else {
              currentVersion = version
            }
          })
        }
      });
    }
  })
})

ipcMain.on('elegirVersion', (event, args) => {
  changeVersionWindow()
})

function errorDescargarForge(version) {

}

function createErrorVersion() {
  versionWindow = new BrowserWindow({
    width: 800,
    height: 200,
    darkTheme: true,
    icon: "./src/public/img/icono.png",
    center: true,
    frame: false,
    resizable: false,
    title: "Error!",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  versionWindow.loadFile(__dirname + "/../views/errorVersion.html")
}

function createErrorDescForgeWin() {
  forgeErrorDescWindow = new BrowserWindow({
    width: 800,
    height: 200,
    darkTheme: true,
    icon: "./src/public/img/icono.png",
    center: true,
    frame: false,
    resizable: false,
    title: "Error!",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  forgeErrorDescWindow.loadFile(__dirname + "/../views/errorDescForge.html")
}

function createForgeError(version) {
  forgeErrorWindow = new BrowserWindow({
    width: 800,
    height: 300,
    darkTheme: true,
    icon: "./src/public/img/icono.png",
    center: true,
    frame: false,
    resizable: false,
    title: "Error!",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  forgeErrorWindow.loadFile(__dirname + "/../views/errorForge.html")

  setTimeout(() => {
    forgeErrorWindow.webContents.send('versionForge', [version])
  }, 300);
}

function createMain() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    darkTheme: true,
    icon: "./src/public/img/icono.png",
    center: true,
    frame: false,
    resizable: false,
    title: "Minecraft Manager",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.on('closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.setMenu(null);

  mainWindow.loadFile(__dirname + "/../views/menu.html");
}

function changeVersionWindow() {
  mainWindow.loadFile(__dirname + "/../views/elegirVersion.html")

  setTimeout(() => {
    mainWindow.webContents.send('mandarVersiones', [versiones])
  }, 100);


}

app.whenReady().then(() => {
  createMain();

  globalShortcut.register('Ctrl+Shift+I', () => {
    mainWindow.webContents.toggleDevTools();
  })


})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})