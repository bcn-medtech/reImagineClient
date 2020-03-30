const CONSTANTS = {};

CONSTANTS.INSTALLERS = {};

CONSTANTS.INSTALLERS.WIN = 'installers\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.LIN = 'installers/Miniconda3-latest-Linux--x86_64.sh';
CONSTANTS.INSTALLERS.MAC = 'installers/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_WIN = 'resources\\win32\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.DEV_LIN = 'public/resources/linux/Miniconda3-latest-Linux-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_MAC = 'public/resources/mac/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.CONDAPATH = "$HOME/miniconda3";

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


function createEnvExecute(PrepareConda){
  var child = exec.execFile;
  var Promise = require('bluebird');
  function promiseProcess(prog) {
    return new Promise(function (resolve, reject) {
      prog.addListener('error', reject);
      prog.addListener('exit', resolve);
    })
  }

  var prepare_path = (isDev ? path.join('scripts', 'deiden', PrepareConda) : path.join('scripts', 'deiden', PrepareConda));
  const prepare = child(__dirname + '/' + prepare_path, { env: 'bin/bash' });

  promiseProcess(prepare).then(function (result) {
    console.log('promise complete: ' + result);
  }, function (err) {
    console.log('promise rejected: ' + err);
  });
  prepare.stdout.on('data', (data) => {
    console.log(`data ${data}`)
  });

  prepare.stderr.on('data', (data) => {
    console.log('errdata', data);
  });

  prepare.on('exit', (data) => {
    console.log(`final data = ${data}`);
  })
}




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



function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);      
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile);
      } else if (fs.statSync(curFile).isDirectory()) {
       walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  return filesToReturn; 
}

function getRunDeidPath(){
  var ExecuteOs;
  if (process.platform === 'win32') {
    ExecuteOs = path.join('win32', 'runDeid.bat');
  } else {
    ExecuteOs = path.join('linux', 'runDeid.sh');
  }
  var Script_Path = (isDev ? path.join(__dirname, 'scripts', 'deiden', ExecuteOs) : path.join(__dirname, 'scripts', 'deiden', ExecuteOs));
  return Script_Path
}

function getDeidTestPath(){
  let file = (isDev ? path.join(__dirname, 'scripts', 'deiden', 'src', 'deidTest_pyd.py') : path.join(__dirname,"..", "..", "..", 'Scripts', 'deiden', 'src', 'deidTest_pyd.py'));
  return file;
}

function getOutputPath(){
  const home = require('os').homedir();
  let outPath = path.join(home,'Documents','Anonimized_Files')
  if(!fs.existsSync(outPath)){
    fs.mkdirSync(outPath);
  }
  return outPath;
}
require("http").createServer(function (req, res) {
  res.end("Hello from server started by Electron app!");
})
var express = require('express');
var api = express();

var things = require('../src/things');

//both index.js and things.js should be in same directory
api.use('/api', things);


api.listen(3001, function () {
    console.log('API reimagine listening on port 3001!');
});

