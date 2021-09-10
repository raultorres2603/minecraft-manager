const { app, BrowserWindow, ipcMain, Menu, WebContents,globalShortcut } = require('electron')
const path = require('path')
const fs = require('fs');
const os = require('os');

require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  });

var mainWindow

ipcMain.on('cerrarApp', (event, args) => {
    if (process.platform !== 'darwin') app.quit()
})

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

app.whenReady().then(() => {
    createMain();

    globalShortcut.register('Ctrl+Shift+I', () => {
        mainWindow.webContents.toggleDevTools();
      })
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })