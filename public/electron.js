//import {CONSTANTS} from './constants';
/* 
electron.js

  "Server side" file. electron have to play with stuff react cannot play, like interactions with os,file searching and so long.

  we use two basic imports: ipcMain and ipcRenderer.

  ipcMain is for recieve and send calls from/to react. ipcRenderer has the same objective but implemented on react, to render responses of icpMain
*/

const CONSTANTS = {};

CONSTANTS.INSTALLERS = {};

CONSTANTS.INSTALLERS.WIN = 'installers\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.LIN = 'installers/Miniconda3-latest-Linux--x86_64.sh';
CONSTANTS.INSTALLERS.MAC = 'installers/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_WIN = 'public\\resources\\win\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.DEV_LIN = 'public/resources/linux/Miniconda3-latest-Linux-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_MAC = 'public/resources/mac/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.CONDAPATH = "$HOME/miniconda3";


const electron = require('electron');
const { Menu, Tray } = require('electron')


const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
//const os = require('os');

const path = require('path');
//const url = require('url');
const fs = require('fs');

const { ipcMain } = require('electron');

let mainWindow;
console.log(isDev, 'isDev');
console.log(process.platform);

/* 
  Creation of main window with this function. the loading of first page starts on a html template that runs our framework
*/
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, frame: true, webPreferences: { webSecurity: false } });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


// Tray just let us have an icon saved in taskbar to do more easily to use the app and do it less heavy interface
let tray = null
app.on('ready', () => {
  tray = new Tray(isDev ? path.join('public', 'resources', 'icons', 'lung.png') : path.join('resources', 'icons', 'lung.png'));
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




app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    console.log("Close the taskbar icon if you really want to call app.quit()")
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

// Request to install a dependency. Returns boolean saying if it is installed or not.
// Only work in linux, maybe in mac and not windows, pending...
ipcMain.on('Install_Request', (event, arg) => {

  console.log('install request action');

  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('Scripts', ExecuteOs));

  // De momento cada SO tiene un modo de lectura de archivos, pero en principio no hace falta
  if (process.platform == 'win32') {
    console.log('hola windows');
    const searchProgram = require('child_process').execFile(SearchUbi, [arg]);

    searchProgram.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    searchProgram.stderr.on('dataerr', (data) => {
      console.log(`dataerr: ${data}`);
    });

    searchProgram.on('exit', (data) => {
      console.log(`final data ${data}`);

      if (data === 1) event.sender.send('InstallAnswer', false);
      else {
        fs.readFile(`public\\scripts\\tmp\\${arg}.txt`, 'utf-8', (err, data) => {
          console.log(data);
          event.sender.send('InstallAnswer', data);
        })
      }
    })

  } else {
    console.log('OS Unix');
    console.log("Program to install: " + arg);
    var exec = require('child_process');
    //Check if program is installed
    exec.execFile(__dirname + '/' + SearchUbi, [arg], (err, stdout, stderr) => {
      if (err){
        console.log("err")
        throw err;
      }
      //console.log("StdOut: "+stdout.toString()+".");
      //console.log("StdErr: ",stderr);
      if (typeof stdout === 'string'){
        //When program not found, stdout=\n
        if(stdout.toString() !== '\n'){
          event.returnValue = true; //Already installed
        }else{
          //If not installed, install conda. Not prepared for others
          if(arg == 'conda'){
            installMiniconda()
            event.returnValue = true;
          }else{
            event.returnValue = false;
          }
        }
      }
    })
  }
});

//Call with sendSync and returns bool
ipcMain.on('Install_Check', (event, arg) => {
  var exec = require('child_process');
  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('Scripts', ExecuteOs));

  exec.execFile(__dirname + '/' + SearchUbi, [arg], (err, stdout, stderr) => {
    if (err){
      console.log("err")
      throw err;
    }
    //console.log("StdOut: ",stdout.toString());
    //console.log("StdErr: ",stderr);
    if (typeof stdout === 'string'){
      //When program not found, stdout=\n
      if(stdout.toString() !== '\n'){
        event.returnValue = true;
      }else{
        event.returnValue = false;
      }
    }else{
      event.returnValue = false;
    }
  })
});

// Script to isntall program requested for, like miniconda
function installMiniconda(){
  // Set the installation path, check if exists, else install. THE RETURNS AREN'T IMPORTANT by now
  const fs = require("fs"); 
  const homedir = require('os').homedir();
  let path = CONSTANTS.INSTALLERS.CONDAPATH.replace("$HOME", homedir);
  if (fs.existsSync(path)) {
    console.log("Conda already installed");
    return true;
  }else{
    //if (arg !== null) {
      //console.log("Args: ",arg);
      var os = process.platform;
      var executablePath;
      if (os == "win32") {
        executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_WIN : CONSTANTS.INSTALLERS.WIN);
      }
      else if (os == 'MacOS') {
        executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_MAC : CONSTANTS.INSTALLERS.MAC);
      }
      else if (os === 'linux') {
        executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_LIN : CONSTANTS.INSTALLERS.LIN);
      }
      //event.sender.send('execute_anonimizer_response', arg);

      var child = require('child_process').execFile;
      child(executablePath, ["-b", "-p "+CONSTANTS.INSTALLERS.CONDAPATH], function (err, data) {
        if (err) {
          console.error("Installation error", err);
          return false;
        }
        console.log('Miniconda has been installed');
        console.log("Installation Output: ", data.toString());
        return true;
      });
    //} 
  }
  return;
}

// Runs a conda script, first run createEnv to prepare conda environment. Secondly runs runDeid, to run deidentification script.
ipcMain.on('Conda_Script', (event, arg, arg1) => {
  //console.log(process.env.SHELL);
  console.log('Conda_script');
  var ExecuteOs, PrepareConda;

  if (process.platform === 'win32') {
    ExecuteOs = path.join('win', 'runDeid.bat');
    PrepareConda = path.join('win', 'createEnv.bat');
  }
  else {
    ExecuteOs = path.join('linux', 'runDeid.sh');
    PrepareConda = path.join('linux', 'createEnv.sh');
  }

  var Promise = require('bluebird');
  function promiseProcess(prog) {
    return new Promise(function (resolve, reject) {
      prepare.addListener('error', reject);
      prepare.addListener('exit', resolve);
    })
  }

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));
  var prepare_path = (isDev ? path.join('scripts', 'deiden', PrepareConda) : path.join('Scripts', 'deiden', PrepareConda));
  console.log(Script_Path);

  const prepare = require('child_process').execFile(__dirname + '/' + prepare_path, { env: 'bin/bash' });

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


  const argv = [arg1, arg1 + 'output'];
  //console.log(argv);
  const deploySh = require('child_process').execFile(`${__dirname}/${Script_Path}`, argv);

  deploySh.stdout.on('data', (data) => {
    console.log(`data for script: ${data}`);
  });

  deploySh.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`)
  })

  deploySh.on('exit', (data) => {
    console.log(`final data ${data}`);
    event.sender.send('finished_deid', argv[0]);
  })
});

ipcMain.on('console-log', (event, arg) => {
  console.log(arg);
  event.returnValue = 'Done';
})

// uploading of images deidentificated for deid script
ipcMain.on('CondaUpload', (event, arg) => {
  let port = arg[1];
  /* horizontal bar, pacs selector before send orthanc button  */
  console.log('conda upload');
  if (process.platform === 'win32') {
    ExecuteOs = path.join('win', 'uploadImages.bat');
  }
  else {
    ExecuteOs = path.join('linux', 'uploadImages.sh');
  }

  switch (port) {
    case 'deeprad':
      port = 32713
      break;
    case 'usimage':
      port = 30605
    default:
      port = 30605
      break;
  }


  console.log(__dirname);
  console.log(arg);

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));

  const upload = require('child_process').execFile(__dirname + '/' + Script_Path, [arg]);

  upload.stdout.on('data', (data) => {
    console.log(`stdout data: ${data}`);
  });

  upload.stderr.on('data', (data) => {
    console.log(`stderr data: ${data}`);
  });

  upload.on('exit', (data) => {
    console.log(`final data: ${data}`);
  });
});

ipcMain.on('Pacs_Request', (event, arg) => {
  var uri = '';
  var opts = {
    // Put CRUD method needed → method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    // if have cors or no-cors → mode: ''
    cache: 'default'

  };
  var data = {};
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', token);

  let request = new request(url, opts);

  return fetch(request).then((response) => {
    if (response.type === "json") {
      return response.json;
    }
    else {
      throw new Error("Request error, Unsupported data " + arg);
    }
  })
})