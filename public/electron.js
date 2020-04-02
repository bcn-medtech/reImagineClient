

const electron = require('electron');
const { Menu, Tray } = require('electron')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const { ipcMain, dialog } = require('electron');
let mainWindow;

let lsPacs = require("./lsPacs");
let lsMinio = require("./lsMinio");
let lsConda = require("./lsConda");



const log = require("electron-log");
Object.assign(console, log.functions);

var appStatus = {
  thirdparty_installed: false,
  logged_in: false,  
  creds: false,       
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        }
    });
    var urlLoc = url.format({
        pathname: path.join(__dirname, '../build/index.html'),
        protocol: 'file:',
        slashes: true
      })
    
    if (isDev) {
      urlLoc = 'http://localhost:3000';
      mainWindow.webContents.openDevTools();      
    }
    

    console.log("Loading version from:"+urlLoc);
    mainWindow.loadURL(urlLoc);
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
//Call with sendSync and returns bool and description
ipcMain.on('Install_Check', (event, arg) => { event.result = lsConda.installCheck()});
// Runs a conda script, first run createEnv to prepare conda environment. Secondly runs runDeid, to run deidentification script.
ipcMain.on('condaAnonimizeRequest', (event, files, outDir) => {
  let [res, resOut, anonDir] = lsConda.runCondaAnonimizer(files, outDir)
  event.returnValue = [res, resOut, anonDir]
});


//python src/deidTest_pyd.py $basedir --outdir $outdir
ipcMain.on('console-log', (event, arg) => {
  console.log(arg);
  event.returnValue = 'Done';
})

// uploading of images deidentificated for deid script
ipcMain.on('MinioUpload', (event, uploadDir, tmpDir) => { 

  new Promise(resolve => {
    let res = false
    
    res = lsMinio.minioUpload(uploadDir, tmpDir)    
    
    resolve("success")
  })
  .then((value) => {
    event.reply("uploadResult",value);
  })
  .catch(e => {
    event.reply("uploadResult",e);
  })
  

});

// uploading of images deidentificated for deid script
ipcMain.on('CondaUpload', (event, arg, arg1) => { lsPacs.pacsUpload(event, arg, arg1); });
ipcMain.on('Pacs_Request', (event, arg) => { lsPacs.pacsRequest(event, arg); });

ipcMain.on('checkStatus', (event) => {
  // Run internal checks or wait for other to fire the event?
  let errs = lsConda.installCheck();
  appStatus.thirdparty_installed = (errs.length? false: true)

  console.log("Errs"+errs)
  console.log("Status"+appStatus.thirdparty_installed)
  event.reply("onStatusUpdate", appStatus)
})

ipcMain.on('select-dirs', async (event, args) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  event.reply("onDirSelection",result.filePaths)
})


