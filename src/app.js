const { app, BrowserWindow, ipcMain, Menu, globalShortcut, webContents, ipcRenderer } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')
const fs = require('fs');
const os = require('os');
const url = require('url');
const https = require('https');
const { exec, spawn, execFile } = require('child_process');
var wget = require('node-wget');

var mainWindow;
var versiones = require("./public/versiones/versiones.json");
var versionWindow;
var forgeErrorWindow;
var forgeErrorDescWindow;
var errorModsExtensionWindow;
var errorTexturePacksWindow;
var errorTextureInstallWindow;
var errorOptifineInstaladoWindow;
var crearModsWindow;
var crearOptifineWindow;
var currentVersion;

ipcMain.on('cerrarApp', (event, args) => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('actualizarTexturasDirectorios', (event, args) => {
  fs.readdir(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs"), (err, files) => {
    if (err) {
      fs.mkdir(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs"), { recursive: true }, (err) => {
        if (err) {
          errorCreateDirectorioTextures();
        } else {
          fs.readdir(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs"), (err, files) => {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
              if (err) {
                fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), { recursive: true }, (err) => {
                  if (err) {
                    errorCreateDirectorioTextures();
                  } else {
                    fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
                      mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesMinecraft])
                    });
                  }
                })
              } else {
                mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesMinecraft])
              }
            })
            mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesMinecraft])
          })
        }
      })
    } else {
      fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
        if (err) {
          fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), { recursive: true }, (err) => {
            if (err) {
              errorCreateDirectorioTextures();
            } else {
              fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
                mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesMinecraft])
              });
            }
          })
        } else {
          mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesMinecraft])
        }
      })
    }
  })

})

ipcMain.on('instalarTextures', (event, args) => {
  fs.readdir(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs"), (err, files) => {
    if (err) {
      fs.mkdir(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs"), { recursive: true }, (err) => {
        if (err) {
          errorCreateDirectorioTextures();
        } else {
          fs.readdir(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs"), (err, files) => {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
              if (err) {
                fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), { recursive: true }, (err) => {
                  if (err) {
                    errorCreateDirectorioTextures();
                  } else {
                    fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
                      mainWindow.loadFile(__dirname + "/../views/instalarTextures.html");
                      setTimeout(() => {
                        mainWindow.webContents.send('filesTextures', [files, filesMinecraft])
                      }, 300);
                    });
                  }
                })
              } else {
                mainWindow.loadFile(__dirname + "/../views/instalarTextures.html");
                setTimeout(() => {
                  mainWindow.webContents.send('filesTextures', [files, filesMinecraft])
                }, 300);
              }
              mainWindow.loadFile(__dirname + "/../views/instalarTextures.html");
              setTimeout(() => {
                mainWindow.webContents.send('filesTextures', [files, filesMinecraft])
              }, 300);
            })
          })
        }
      })
    } else {
      fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
        if (err) {
          fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), { recursive: true }, (err) => {
            if (err) {
              errorCreateDirectorioTextures();
            } else {
              fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesMinecraft) => {
                mainWindow.loadFile(__dirname + "/../views/instalarTextures.html");
                setTimeout(() => {
                  mainWindow.webContents.send('filesTextures', [files, filesMinecraft])
                }, 300);
              });
            }
          })
        } else {
          mainWindow.loadFile(__dirname + "/../views/instalarTextures.html");
          setTimeout(() => {
            mainWindow.webContents.send('filesTextures', [files, filesMinecraft])
          }, 300);
        }
      })
    }
  })

})

ipcMain.on('cerrarInstalarTextures', (event, args) => {
  mainWindow.loadFile(__dirname + "/../views/menu.html");
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

ipcMain.on('cerrarErrorOptifine', (event, args) => {
  errorOptifineInstaladoWindow.close();
})

ipcMain.on('cerrarInstalarMods', (event, args) => {
  mainWindow.loadFile(__dirname + "/../views/menu.html");
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
          let forge = exec(`java -jar ${path.join(os.homedir(), "Downloads", `forge-${currentVersion}.jar`)}`, (err, stdout, stderr) => {
            if (err) {
              console.log(err)
            }
            if (stdout) {
              forge.kill();
              fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, files) => {
                if (err) {
                  fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), { recursive: true }, (err) => {
                    if (err) {
                      errorCrearCarpetaMods();
                    }
                  })
                }
              });
              //setTimeout(() => {
              fs.unlink(`${path.join(os.homedir(), "Downloads", `forge-${currentVersion}.jar`)}`, (error) => {
                if (error) {
                  console.log(error)
                  forgeErrorWindow.close();
                } else {
                  forgeErrorWindow.close();
                }
              });
              //}, 3000);
            }
          })
        })
      })
    }
  });
})

ipcMain.on('leerDirectorioMods', (event, args) => {
  fs.readdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Mods'), (err, files) => {
    if (err) {
      fs.mkdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Mods'), { recursive: true }, (err) => {
        if (err) {
          console.log(err);
        } else {
          fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, filesModsMinecraft) => {
            if (err) {
              fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), { recursive: true }, (err) => {
                if (err) {
                  errorCrearCarpetaMods();
                } else {
                  mainWindow.webContents.send('filesDirectorioMods', [files, filesModsMinecraft]);
                }
              })
            } else {
              mainWindow.webContents.send('filesDirectorioMods', [files, filesModsMinecraft]);
            }
          })
        }
      });
    } else {
      fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, filesModsMinecraft) => {
        if (err) {
          fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), { recursive: true }, (err) => {
            if (err) {
              errorCrearCarpetaMods();
            } else {
              mainWindow.webContents.send('filesDirectorioMods', [files, filesModsMinecraft]);
            }
          })
        } else {
          mainWindow.webContents.send('filesDirectorioMods', [files, filesModsMinecraft]);
        }
      })
    }
  })
})

ipcMain.on('comprobarVersionOptifine', (event, args) => {
  let version = args[0];
  fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "versions", version), (err, files) => {
    if (err) {
      event.sender.send('comprobarVersion_ok', ["error", version])
    } else {
      versiones.forEach(elemento => {
        if (elemento.version == version) {
          currentVersion = version;

          fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "versions"), (err, files) => {
            if (err) {

            } else {
              event.sender.send('instalandoOptifine');

              wget({url: elemento.optifine, dest:`${path.join(os.homedir(), "Downloads", `optifine-${currentVersion}.jar`)}`}, (error, response, body) => {
                if (err) {
                  console.log(err);
                } else {
                  let optifine = exec(`java -jar ${path.join(os.homedir(), "Downloads", `optifine-${currentVersion}.jar`)}`, (err, stdout, stderr) => {
                    if (err) {
                      console.log(err)
                    } else {
                      if (stdout) {
                        optifine.kill();
                        //setTimeout(() => {
                        fs.unlink(`${path.join(os.homedir(), "Downloads", `optifine-${currentVersion}.jar`)}`, (error) => {
                          if (error) {
                            console.log(error)
                            createWindowOptifineError()
                          } else {
                            createWindowOptifineSuccess()
                          }
                        });
                        //}, 3000);
                      }
                    }
                  })
                }
              })
            }
          })

          /*
          let numeritos = directorioVersion.substring(directorioVersion.indexOf("-"), directorioVersion.length);
          let carpetaVersion = `${versionString}-forge${numeritos}`

          fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "versions", carpetaVersion), (err, files) => {
            if (err) {
              currentVersion = version
              createForgeError(version)
            } else {
              currentVersion = version
              instalarModsWindow(currentVersion);
            }
          })
          */
        }
      });
    }
  })
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
              instalarModsWindow(currentVersion);
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

ipcMain.on('elegirVersionOptifine', (event, args) => {
  changeVersionOptifineWindow()
})

ipcMain.on('cerrarCarpetaModsError', (event, args) => {
  crearModsWindow.close();
})

ipcMain.on('cerrarOptifineInstalled', (event, args) => {
  crearOptifineWindow.close();
  mainWindow.loadFile(__dirname + "/../views/menu.html")
})

ipcMain.on('removeMods', (event, args) => {
  let files = args[0];

  files.forEach(file => {
    fs.rename(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods", file), path.join(os.homedir(), "Documents", "MinecraftManager", "Mods", file), (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.readdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Mods'), (err, files) => {
          if (err) {
            console.log(err);
          } else {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, filesModsMinecraft) => {
              if (err) {
                console.log(err)
              } else {
                mainWindow.webContents.send('filesDirectorioMods', [files, filesModsMinecraft]);
              }
            })
          }
        })
      }
    })
  });
})

ipcMain.on('removeTextures', (event, args) => {
  let files = args[0];

  files.forEach(file => {
    fs.rename(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks", file), path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs", file), (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.readdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Texture-Packs'), (err, files) => {
          if (err) {
            console.log(err);
          } else {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesTexturesMinecraft) => {
              if (err) {
                console.log(err)
              } else {
                mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesTexturesMinecraft]);
              }
            })
          }
        })
      }
    })
  });
})

ipcMain.on('installTextures', (event, args) => {
  let files = args[0];

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let posPunto = file.lastIndexOf(".");
    let extension = file.substring(posPunto, file.length);
    console.log(extension);
    if (extension != ".zip" && extension != ".tar" && extension != ".gz" && extension != ".7z" && extension != ".rar") {
      return errorInstallTextures(file);
    }
  }

  files.forEach(file => {
    fs.rename(path.join(os.homedir(), "Documents", "MinecraftManager", "Texture-Packs", file), path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks", file), (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.readdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Texture-Packs'), (err, files) => {
          if (err) {
            console.log(err);
          } else {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "resourcepacks"), (err, filesTexturesMinecraft) => {
              if (err) {
                console.log(err)
              } else {
                mainWindow.webContents.send('actualizarTexturasDirectorios_ok', [files, filesTexturesMinecraft]);
              }
            })
          }
        })
      }
    })
  });

})

ipcMain.on('installMods', (event, args) => {
  let files = args[0];

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let posPunto = file.lastIndexOf(".");
    let extension = file.substring(posPunto, file.length);
    if (extension != ".jar") {
      return errorModsExtension(file);
    }
  }

  files.forEach(file => {
    fs.rename(path.join(os.homedir(), "Documents", "MinecraftManager", "Mods", file), path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods", file), (err) => {
      if (err) {
        console.log(err);
      } else {
        fs.readdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Mods'), (err, files) => {
          if (err) {
            console.log(err);
          } else {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, filesModsMinecraft) => {
              if (err) {
                console.log(err)
              } else {
                mainWindow.webContents.send('filesDirectorioMods', [files, filesModsMinecraft]);
              }
            })
          }
        })
      }
    })
  });
})

ipcMain.on('cerrarErrorModsExtension', (event, args) => {
  errorModsExtensionWindow.close();
})

ipcMain.on('cerrarCarpetaTextureError', (event, args) => {
  errorTexturePacksWindow.close();
})

ipcMain.on('cerrarErrorInstallTextures', (event, args) => {
  errorTextureInstallWindow.close()
})

function errorCreateDirectorioTextures() {
  errorTexturePacksWindow = new BrowserWindow({
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
  errorTexturePacksWindow.loadFile(__dirname + "/../views/errorCrearDirectorioTextures.html")
}

function createWindowOptifineSuccess() {
  crearOptifineWindow = new BrowserWindow({
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
  crearOptifineWindow.loadFile(__dirname + "/../views/optifineSuccess.html")
}

function cerrarOptifineInstalled() {
  crearOptifineWindow.close();
}

function errorCrearCarpetaMods() {
  crearModsWindow = new BrowserWindow({
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
  crearModsWindow.loadFile(__dirname + "/../views/errorCrearCarpetaMods.html")
}

function createOptifineInstaladoError() {
  errorOptifineInstaladoWindow = new BrowserWindow({
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
  errorOptifineInstaladoWindow.loadFile(__dirname + "/../views/errorOptifineInstalado.html");
}

function errorModsExtension(file) {
  errorModsExtensionWindow = new BrowserWindow({
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
  errorModsExtensionWindow.loadFile(__dirname + "/../views/errorModsExtension.html");

  setTimeout(() => {
    errorModsExtensionWindow.webContents.send('errorFileMod', [file])
  }, 300);
}

function errorInstallTextures(file) {
  errorTextureInstallWindow = new BrowserWindow({
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
  errorTextureInstallWindow.loadFile(__dirname + "/../views/errorInstallTextures.html");

  setTimeout(() => {
    errorTextureInstallWindow.webContents.send('errorFileTextures', [file])
  }, 300);
}

function instalarModsWindow(currentVersion) {
  mainWindow.loadFile(__dirname + '/../views/instalarMods.html');

  setTimeout(() => {
    fs.readdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Mods'), (err, files) => {
      if (err) {
        fs.mkdir(path.join(os.homedir(), 'Documents', 'MinecraftManager', 'Mods'), { recursive: true }, (err) => {
          if (err) {
            console.log(err);
          } else {
            fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, filesModsMinecraft) => {
              if (err) {
                fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), { recursive: true }, (err) => {
                  if (err) {
                    errorCrearCarpetaMods();
                  } else {
                    mainWindow.webContents.send('versionInstalarMods', [currentVersion, files, filesModsMinecraft]);
                  }
                })
              } else {
                mainWindow.webContents.send('versionInstalarMods', [currentVersion, files, filesModsMinecraft]);
              }
            })
          }
        });
      } else {
        fs.readdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), (err, filesModsMinecraft) => {
          if (err) {
            fs.mkdir(path.join(os.homedir(), "AppData", "Roaming", ".minecraft", "mods"), { recursive: true }, (err) => {
              if (err) {
                errorCrearCarpetaMods();
              } else {
                mainWindow.webContents.send('versionInstalarMods', [currentVersion, files, filesModsMinecraft]);
              }
            })
          } else {
            mainWindow.webContents.send('versionInstalarMods', [currentVersion, files, filesModsMinecraft]);
          }
        })
      }
    })
  }, 200);
}

function errorDescargarForge(version) {
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
    mainWindow.show();
    autoUpdater.checkForUpdatesAndNotify();
  })

  mainWindow.loadFile(__dirname + "/../views/menu.html");
}

function changeVersionWindow() {
  mainWindow.loadFile(__dirname + "/../views/elegirVersion.html")

  setTimeout(() => {
    mainWindow.webContents.send('mandarVersiones', [versiones])
  }, 100);

}

function changeVersionOptifineWindow() {
  mainWindow.loadFile(__dirname + "/../views/elegirVersionOptifine.html")

  setTimeout(() => {
    mainWindow.webContents.send('mandarVersiones', [versiones])
  }, 100);
}

app.whenReady().then(() => {
  createMain();

  Menu.setApplicationMenu(null);

  //globalShortcut.register('Ctrl+Shift+I', () => {
  //  mainWindow.webContents.toggleDevTools();
  //})


})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});