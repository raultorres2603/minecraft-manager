const { app, BrowserWindow, ipcMain, Menu, globalShortcut, webContents } = require('electron')
const path = require('path')
const fs = require('fs');
const os = require('os');
const url = require('url');
const { exec, spawn } = require('child_process');

require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
});

var mainWindow;
var versiones = require("./public/versiones/versiones.json");
var versionWindow;
var currentVersion;

ipcMain.on('cerrarApp', (event, args) => {
  if (process.platform !== 'darwin') app.quit()
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

ipcMain.on('comprobarVersion', (event, args) => {
  let version = args[0];
  fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "versions", version), (err, files) => {
    if (err) {
      event.sender.send('comprobarVersion_ok', ["error", version])
    } else {
      console.log(files);
    }
  })
})

ipcMain.on('elegirVersion', (event, args) => {
  changeVersionWindow()
})

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