const { app, BrowserWindow, ipcMain } = require('electron')

var mainWindow

function createMain() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        darkTheme: true,
        center: true,
        frame: false,
        resizable: false,
        title: "Minecraft Manager",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
            
          },
    })

    mainWindow.on('closed', () => {
        app.quit()
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
      })

    mainWindow.setMenu(null);

    mainWindow.loadFile(__dirname + "/../views/menu.html");
}

app.whenReady().then(() => {
    createMain();
  })

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })