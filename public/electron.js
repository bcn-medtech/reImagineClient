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
CONSTANTS.INSTALLERS.LIN = 'installers/Miniconda3-latest-linux--x86_64.sh';
CONSTANTS.INSTALLERS.MAC = 'installers/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_WIN = 'public\\resources\\win\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.DEV_LIN = 'public/resources/linux/Miniconda3-latest-linux-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_MAC = 'public/resources/mac/Miniconda3-latest-MacOSX-x86_64.sh';


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

// implement of linux startup extension for possible problems with platforms like fedora.
/* if (process.platform === 'linux') {
  console.log(__dirname);
  const exec = require('child_process').execFile;
  var exPath = (isDev ? 'scripts/fedora/fedora.sh' : 'Scripts/fedora/fedora.sh');
  var Fedora = exec(exPath);
  
  Fedora.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  })

  Fedora.stderr.on('data',(data) => {
    console.log(`stderr: ${data}`);
  })

  Fedora.on('close',(code) => {
    console.log(`final data: ${code}`);
  })

} */

/* 
  Creation of main window with this function. the loading of first page starts on a html template that runs our framework
*/
function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { webSecurity: false } });
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

// Request to install a dependency. React asks to electron if a dependency needed to run a script exists in our pc.
// If it exists, the script will run normally, if it does not, the app will advice you to install the dependencies needed
// going to dependencies page.
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

  }

  else {
    console.log('hola unix');
    var exec = require('child_process');
    exec.execFile(__dirname + '/' + SearchUbi, [arg], (err, stdout, stderr) => {
      if (err) throw err;
      console.log(stdout);
      if (typeof stdout === 'string') event.sender.send('InstallAnswer', stdout);
      else event.sender.send('InstallAnswer', false);
    })
  }
});


// Script to isntall program requested for, like miniconda
ipcMain.on('Miniconda_Install', (event, arg, arg1) => {


  if (arg !== null) {
    console.log(arg);
    console.log('Miniconda has been installed');

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

    var child = require('child_process').execFile;
    event.sender.send('execute_anonimizer_response', arg);

    child(executablePath, function (err, data) {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data.toString());
    });
  }
});


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
      prepare.addListener('error',reject);
      prepare.addListener('exit',resolve);
    })
  }

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));
  var prepare_path = (isDev ? path.join('scripts', 'deiden', PrepareConda) : path.join('Scripts', 'deiden', PrepareConda));
  console.log(Script_Path);

  const prepare = require('child_process').execFile(__dirname + '/' + prepare_path, { env: 'bin/bash' });

  promiseProcess(prepare).then(function (result) {
    console.log('promise complete: ' +  result);
  }, function(err) {
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


// uploading of images deidentificated for deid script
ipcMain.on('CondaUpload', (event, arg) => {
  console.log('conda upload');
    if (process.platform === 'win32') {
      ExecuteOs = path.join('win', 'uploadImages.bat');
    }
    else {
      ExecuteOs = path.join('linux', 'uploadImages.sh');
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