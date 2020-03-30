
let config = require("./config");
const CONSTANTS = config.CONSTANTS;
const electron = require('electron');
const { Menu, Tray } = require('electron')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');
const fs = require('fs');
const exec = require('child_process');
const { ipcMain } = require('electron');
let mainWindow;

let lsPacs = require("./lsPacs");
let lsMinio = require("./lsMinio");
let lsConda = require("./lsConda");

const log = require("electron-log");
Object.assign(console, log.functions);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    // mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// Tray just let us have an icon saved in taskbar to do more easily to use the app and do it less heavy interface
let tray = null
app.on('ready', () => {
  tray = new Tray(isDev ? path.join('public', 'resources', 'icons', 'lung.png') : path.join('icons', 'lung.png'));
  const trayMenuTemplate = [
    {
      label: 'open window',
      click: function () {
        createWindow();
      }
    },
    {
      label: '3rdPart Installers',
      click: function () {
        mainWindow.loadURL(isDev ? 'http://localhost:3000/installers' : `file://${path.join(__dirname, '../build/index.html#/installers')}`);
      }
    }, {
      label: 'Quit',
      click: function () {
        app.quit()
      }
    }
  ]
  let contextMenu = Menu.buildFromTemplate(trayMenuTemplate)
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  createWindow();

  tray.on('click', () => {
    if (mainWindow == null) {
      createWindow()
    } else if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }
  });

  tray.on('double-click', () => {
    if (mainWindow == null) {
      createWindow();
    }
    else if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else mainWindow.show();
  })

})


//app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});


ipcMain.on('Install_Request', (event, arg) => { lsConda.installRequest(event, arg)});
//Call with sendSync and returns bool
ipcMain.on('Install_Check', (event, arg) => { lsConda.installCheck(event, arg)});
// Runs a conda script, first run createEnv to prepare conda environment. Secondly runs runDeid, to run deidentification script.
ipcMain.on('Conda_Script', (event, arg1, arg2) => {lsConda.condaScript(event, arg1, arg2)});


//python src/deidTest_pyd.py $basedir --outdir $outdir
ipcMain.on('console-log', (event, arg) => {
  console.log(arg);
  event.returnValue = 'Done';
})

// uploading of images deidentificated for deid script
ipcMain.on('MinioUpload', (event, arg, arg1) => { lsMinio.minioUpload(event, arg, arg1)});

// uploading of images deidentificated for deid script
ipcMain.on('CondaUpload', (event, arg, arg1) => { lsPacs.pacsUpload(event, arg, arg1); });
ipcMain.on('Pacs_Request', (event, arg) => { lsPacs.pacsRequest(event, arg); });



