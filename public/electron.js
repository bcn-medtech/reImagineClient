
const electron = require('electron');
const { Menu, Tray } = require('electron')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

const { ipcMain, dialog } = require('electron');
let mainWindow;

var config = require("./config");

const log = require("electron-log");
log.transports.file.level = "info";
log.transports.file.file = path.join(config.logDir, "log_Main.txt")

Object.assign(console, log.functions);

function getConfig() {
  return config
}

module.exports = {
  getConfig: getConfig
};


let lsPacs = require("./lsPacs");
let lsMinio = require("./lsMinio");
let lsConda = require("./lsConda");
let lsHost = require("./lsHost"); 

const {autoUpdater} = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Current version is ' + app.getVersion() + '. Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

function sendStatusToWindow(text) {
  log.info(text);
  console.log('message', text);
}

var appStatus = {
  required: config.requiredPrograms,
  thirdparty_installed: false,
  logged_in: false,  
  creds: false,       
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 700,
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
      //mainWindow.webContents.openDevTools();      
    } else {
      urlLoc = url.format({
        pathname: path.resolve(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    }
    

    console.log("Loading version from:"+urlLoc);
    console.log("App path is", app.getAppPath());
    writeConfiguration();
    mainWindow.loadURL(urlLoc);
    
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

function writeConfiguration() {
  
  let data = JSON.stringify(config)
  fs.writeFileSync(config.confFile, data)
  console.log(config)  
  
}

// Tray just let us have an icon saved in taskbar to do more easily to use the app and do it less heavy interface
let tray = null
app.on('ready', () => {
  var icon = path.join('public', 'resources', 'icons', 'lung.png');
  if(!isDev) {
    icon = path.join(__dirname, 'resources', 'icons', 'lung.png')
    if (!fs.existsSync(icon)) {
      console.log("CANNOT FIND ICON")
    }
  }
  tray = new Tray(icon);
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
        mainWindow.loadURL(isDev ? 'http://localhost:3000/installers' : url.format({
          pathname: path.join(__dirname, 'index.html#installers'),
          protocol: 'file:',
          slashes: true
        }));
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

  autoUpdater.checkForUpdatesAndNotify();

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


ipcMain.handle('install-ipc', async (event, app) => { 
  console.log("Received ipc invocation for installing: ",app.name)
  try {
    const result = await lsConda.installRequestPromise(app);
    console.log("Received result: ",result)
    return result;
  } catch (error) {
    console.log("Received error: ",error)
    return {status: false, reason: error};
  }
});


// ipcMain.on('removeFolderFromOs', (event, app) => { 
//   // console.log("Received Install request for ",app.name)
//   //   lsConda.installRequest(event, app,(result)=>{
//   //     event.reply("condaInstallRequestFinished",result);
//   //   });
//   console.log("Remove folder from os");
// });

ipcMain.on('condaAnonimizeRequest', (event, files, outDir) => { 

  new Promise(resolve => {  

    lsConda.runCondaAnonimizer(files, outDir,(result)=>{
      console.log(result.res);
      console.log(result.outDir);
  
      if(result.res===1){
        resolve(result);
      }
    });
  })
  .then((value) => {
    console.log("Anonimization done");
    event.reply("condaAnonimizeRequestFinished",value);
  })
  .catch(e => {
    event.reply("condaAnonimizeRequestFinished",e);
  })
  

});

// uploading of images deidentificated for deid script
ipcMain.on('MinioUpload', (event, uploadDir, tmpDir) => { 

  new Promise(resolve => {
    let res = false
    lsMinio.minioUpload(uploadDir, tmpDir,(result1)=>{
      lsHost.removeFolder(uploadDir,(result2)=>{
        resolve(result1);
      });
    });
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

function areProgramsInstalled(programs) {
  console.log("areProgramsInstalled", programs)
  let isOk = true
  let res = lsConda.installChecks(programs);
  for (let _r of res) {
    if (_r.err.length) {
      console.log("Error searching for",_r.name, ": ", _r.err)
      isOk = false
    }
  }
  return [isOk, res]
}

ipcMain.on('checkInstalled', (event, program) => {
  console.log("checkInstalled", program)
  let [isOk, res] = areProgramsInstalled([program])
  event.reply("installedCheckRes", program, isOk, res)
})

ipcMain.on('checkStatus', (event) => {
  // Run internal checks or wait for other to fire the event?
  let [isOk, res] = areProgramsInstalled(appStatus.required)
  appStatus.thirdparty_installed = (isOk? true: false)
  event.reply("onStatusUpdate", appStatus, res)
})

ipcMain.on('select-dirs', async (event, args) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  })
  event.reply("onDirSelection",result.filePaths)
})

ipcMain.on('getConfig', (event) => {
  event.returnValue = getConfig()
})

ipcMain.on('checkUploadCerticates', (event) => {
  const certificatePath=config.confDir+path.sep+"minio.json";
  event.reply("onCheckUploadCerticates",lsHost.checkCertificateInHost(certificatePath));
})


