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
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');
const fs = require('fs');
const exec = require('child_process');
const { ipcMain } = require('electron');
let mainWindow;

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

app.on('ready', createWindow);

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

ipcMain.on('Install_Request', (event, arg) => {

  console.log('install request action');

  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('scripts', ExecuteOs));

  // De momento cada SO tiene un modo de lectura de archivos, pero en principio no hace falta
  if (process.platform == 'win32') {
    console.log('hola windows');
    const searchProgram = exec.execFile(SearchUbi, [arg]);

    searchProgram.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    searchProgram.stderr.on('dataerr', (data) => {
      console.log(`dataerr: ${data}`);
    });
    searchProgram.on('exit', (data) => {
      console.log(`final data ${data}`);
      if (data === 1) event.returnValue = false;
      else {
        fs.readFile(`public\\scripts\\tmp\\${arg}.txt`, 'utf-8', (err, data) => {
          console.log(data);
          //event.sender.send('InstallAnswer', data);
          event.returnValue = true;
        })
      }
    });

  } else {
    console.log('OS Unix');
    console.log("Program to install: " + arg);
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
            let flag = installMiniconda()
            if(flag){
              event.returnValue = true;
            }else{
              event.returnValue = false;
            }
            
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
  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('scripts', ExecuteOs));
  exec.execFile(__dirname + '/' + SearchUbi, [arg], (err, stdout, stderr) => {
    if (err){
      console.log("err")
      event.returnValue = [false, err]
    }else{
      console.log("StdOut: ",stdout);
      console.log("StdErr: ",stderr);
      if (typeof stdout === 'string'){
        //When program not found, stdout=\n
        if(stdout.toString() !== '\n'){
          event.returnValue = [true,stdout];
        }else{
          event.returnValue = [false,stdout];
        }
      }else{
        event.returnValue = [false,stderr];

      }
    }
  })
});

// Script to isntall program requested for, like miniconda
function installMiniconda(){
  // Set the installation path, check if exists, else install. THE RETURNS AREN'T IMPORTANT by now
  const fs = require("fs"); 
  const homedir = require('os').homedir();
  let condaPath = CONSTANTS.INSTALLERS.CONDAPATH.replace("$HOME", homedir);
  let PrepareConda;
  if (fs.existsSync(condaPath)) {
    console.log("Conda already installed");
    return true;
  }else{
    //if (arg !== null) {
      //console.log("Args: ",arg);
      var os = process.platform;
      var executablePath;
      if (os == "win32") {
        executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_WIN : CONSTANTS.INSTALLERS.WIN);
        PrepareConda = path.join('win', 'createEnv.bat');
      }
      else if (os == 'MacOS') {
        executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_MAC : CONSTANTS.INSTALLERS.MAC);
      }
      else if (os === 'linux') {
        executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_LIN : CONSTANTS.INSTALLERS.LIN);
        PrepareConda = path.join('linux', 'createEnv.sh');
      }
      //event.sender.send('execute_anonimizer_response', arg);

      exec.execFile(executablePath, ["-b", "-p "+CONSTANTS.INSTALLERS.CONDAPATH], function (err, data) {
        if (err) {
          console.error("Installation error", err);
          return false;
        }
        console.log('Miniconda has been installed');
        console.log("Installation Output: ", data.toString());
        createEnvExecute(PrepareConda);
        return true;
      });
      
    //} 
  }
  return;
}

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

// Runs a conda script, first run createEnv to prepare conda environment. Secondly runs runDeid, to run deidentification script.
ipcMain.on('Conda_Script', (event, arg, arg1, arg2) => {
  //console.log(process.env.SHELL);
  console.log("Arg2", arg2)
  console.log('Conda_script');
  var ExecuteOs;
  if(!arg){
    event.returnValue = "Conda not installed. Go to Installers page to install it."
    return;
  } else {
    if (process.platform === 'win32') {
      ExecuteOs = path.join('win', 'runDeid.bat');
    } else {
      ExecuteOs = path.join('linux', 'runDeid.sh');
    }
    var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('scripts', 'deiden', ExecuteOs));
    console.log(Script_Path);

    let argv;
    if(fs.existsSync(arg2)){
      argv = [arg1, arg2];
    }else{
      argv = [arg1, arg1 + 'output'];
    }
    console.log(argv);
    const deploySh = exec.execFile(`${__dirname}/${Script_Path}`, argv);

    deploySh.stdout.on('data', (data) => {
      console.log(`Output: ${data}`);
    });

    deploySh.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      event.returnValue = "Anonimized succesfully.";
    })
  }
});

ipcMain.on('console-log', (event, arg) => {
  console.log(arg);
  event.returnValue = 'Done';
})

// uploading of images deidentificated for deid script
ipcMain.on('CondaUpload', (event, arg, arg1) => {
  let port = arg1;
  let file = arg;
  console.log('conda upload');
  console.log("Port", port)
  console.log("file: ",arg);
  /* horizontal bar, pacs selector before send orthanc button  */
  if (process.platform === 'win32') {
    ExecuteOs = path.join('win', 'uploadImages.bat');
  } else {
    ExecuteOs = path.join('linux', 'uploadImages.sh');
  }
  //Constants in constants.json
  // switch (port) {
  //   case 'deeprad':
  //     port = 32713
  //     break;
  //   case 'usimage':
  //     port = 30605
  //   default:
  //     port = 30605
  //     break;
  // }

  // console.log(__dirname);

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('scripts', 'deiden', ExecuteOs));

  const upload = exec.execFile(__dirname + '/' + Script_Path, [file, port]);

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