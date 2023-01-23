
const electron = require('electron');
const { Menu, Tray } = require('electron')
const {shell} = require('electron') // deconstructing assignment
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');
const fs = require('fs');
const fsp = require('fs').promises;
const os = require('os');

const { ipcMain, dialog } = require('electron');
const XLSX = require('xlsx');
const readXlsxFile = require('read-excel-file/node');

let mainWindow;

var config = require("./config");
const log = require("electron-log");

config.logFile = path.join(config.logDir, "log_Main.txt");
log.transports.file.level = "info";
log.transports.file.file = config.logFile
log.transports.file.streamConfig = { flags: 'w'}
log.transports.file.stream = fs.createWriteStream(config.logFile)

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


const newUpdates = {
  curVersion: app.getVersion(), 
  updateFound: false,
  donwloadCompleted: false,
  info: null
};

/*
const {autoUpdater} = require("electron-updater");

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Current version is ' + app.getVersion() + '. Checking for update...');
})

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  newUpdates.donwloadCompleted = true;
  sendStatusToWindow('Update downloaded');
});

autoUpdater.on('update-available', (info) => {
  newUpdates.updateFound = true;
  newUpdates.info = info
  sendStatusToWindow('Update available: '+info);
})

autoUpdater.on('update-not-available', (info) => {
  newUpdates.updateFound = false;
  sendStatusToWindow('Update not available.');
})

autoUpdater.on('error', (err) => {
  //newUpdates=5;
  sendStatusToWindow('Error in auto-updater. ' + err);
})

*/

function sendStatusToWindow(text) {
  log.info(text);
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
        backgroundColor: "#1B1C1E",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
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
    

    console.log("Welcome to version " + app.getVersion())
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

  //autoUpdater.checkForUpdatesAndNotify();

})


//app.on('ready', createWindow);
app.whenReady().then(() => {
  console.log("App is ready!!!");

  createWindow()
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

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


ipcMain.handle('load-form', async (event) => { 
  console.log("Received ipc invocation for loading form data: ",config.metadata_form)
  try {
    var jsform = null; var reas = null
    if (!fs.existsSync(config.metadata_form)) {
      jsform = JSON.stringify({
        schema: {
          title: "Metadata information",
          description: "A form to add information to the images",
          type: "object",
          properties: {
            ann: {
              type: "string",
              title: "Annotation"
            }
          }
        },
        ui: {
          ann: {
            "ui:widget": "textarea"
          }
        },
        data: {
          ann: "New information"
        }
      })
      fs.writeFileSync(config.metadata_form, jsform)
    } 

    jsform = fs.readFileSync(config.metadata_form);
    jsform = JSON.parse(jsform);
    return {form: jsform, reason: reas};
  } catch (error) {
    console.log("Error: ",error)
    return {form: null, reason: error};
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

ipcMain.handle('anonimize-ipc', async (event, files, outDir) => { 
  console.log("Received ipc invocation for anonimizing files: ",files, outDir)  
  try {
    const result = await lsConda.runCondaAnonimizer(files, outDir)
    return result;
  } catch (error) {
    console.log("Received error: ",error)
    return {status: false, reason: error, outDir: outDir};
  }
});

ipcMain.handle('checkUpdate-ipc', async () => {
  return newUpdates;
})

ipcMain.handle('write-annotations', async (event, jsondata, outDir) => { 
  console.log("Received ipc invocation for adding metadata to: ",jsondata, outDir)
  try {
    let data = JSON.stringify(jsondata)
    let fname = path.join(outDir, "annotations.json")
    fs.writeFileSync(fname, data)
    return {status: true, reason: null};
  } catch (error) {
    console.log("Received error: ",error)
    return {status: false, reason: error};
  }
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
const sqlite3 = require('sqlite3').verbose();
const pathSqlFile=config.sqlFile;

async function readSql() {
  return new Promise((resolve, reject) => {
    let data = null;
    let db = new sqlite3.Database(`${pathSqlFile}`, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          reject(err);
        }
        console.log('Connected to the database.');
    });
    // query the data from the table
    db.all(`SELECT * FROM patients`, [], (err, rows) => {
        if (err) {
          reject(err);
        }
        console.log(rows)
        data = rows;
        resolve(data);
    }); 
    // close the database connection
    db.close((err) => {
        if (err) {
          reject(err);
        }
        console.log('Close the database connection.');
    });
  });
}
ipcMain.on('readSql',async (event,arg)=>{
  let data=await readSql().then((res)=>{
    console.log(res[0].anoncode);
    event.reply('readSql', res)
  })
  ;//event.sender.send('readSql', data);
});
ipcMain.on('checkInstalled', (event, program) => {
  console.log("checkInstalled", program)
  let [isOk, res] = areProgramsInstalled([program])
  event.reply("installedCheckRes", program, isOk, res)
})

/*
ipcMain.on('checkStatus', (event) => {
  // Run internal checks or wait for other to fire the event?
  let [isOk, res] = areProgramsInstalled(appStatus.required)
  appStatus.thirdparty_installed = (isOk? true: false)
  event.reply("onStatusUpdate", appStatus, res)
})
*/

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
});


ipcMain.on('quitapp', (event) => {
  console.log("quitapp")
  let isSilent = true
  let isForceRunAfter = true  
  //autoUpdater.quitAndInstall(isSilent, isForceRunAfter)
});

ipcMain.on('open-folder', (event, args) => {
  shell.showItemInFolder(args)
})

ipcMain.on('open-file-dialog', (event) => {
    console.log("********OPEN-FILE-DIALOG****************")
    dialog.showOpenDialog({
        title: 'Seleziona il file Excel da anonimizzare',
        properties: ['openFile'],
        filters: [
            { name: 'Excel', extensions: ['xlsx', 'xls'] },
        ]
    }).then((res)=>{
        console.log(res.filePaths);
        console.log('******RES******');
        let filePaths=res.filePaths[0]
        console.log(filePaths);
        if(!filePaths){
          return
        }
        else{
          readXlsxFile(filePaths, { sheet: 1 }).then((rows) => {
          console.log(rows[0]);
              // Send the selected file's data to the renderer process
          event.sender.send('selected-file', rows);
          });
        }
      });
});

 
