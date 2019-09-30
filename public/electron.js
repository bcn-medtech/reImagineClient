const electron = require('electron');
const { Menu, Tray } = require('electron')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');
const os = require('os');

const path = require('path');
const url = require('url');
const fs = require('fs');

const { ipcMain } = require('electron');

let mainWindow;
console.log(isDev, 'isDev');
console.log(process.platform);

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600, webPreferences: { webSecurity: false } });
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  // mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}


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


ipcMain.on('Install_Request', (event, arg) => {

  console.log('install request action');

  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('Scripts', ExecuteOs));

  console.log(ExecuteOs);
  console.log(SearchUbi);
  console.log(arg, 'plane arg');
  console.log(arg[0], 'point arg');
  console.log(__dirname, '__dirname');


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
    arg = 'conda';
    console.log(arg);
    // exec.exec(`${__dirname}/${SearchUbi}`, ['conda'], (error, stdout, stderr) => {
    exec.exec('sh', 'echo', 'bin', { shell: 'bin/bash' }, (error, stdout, stderr) => {

      if (error) throw error;
      console.log(stdout);
      if (isNaN(stdout)) event.sender.send('InstallAnswer', stdout);
      else event.sender.send('InstallAnswer', false);
    });
  }
});



ipcMain.on('Miniconda_Install', (event, arg, arg1) => {


  if (arg !== null) {
    console.log(arg);
    console.log('Miniconda has been installed');

    var os = process.platform;
    var executablePath;

    if (os == "win32") {

      executablePath = (isDev ? 'public\\resources\\win\\Miniconda2-latest-Windows-x86_64.exe' : 'installers\\Miniconda2-latest-Windows-x86_64.exe');
    }
    else if (os == 'MacOS') {

      executablePath = (isDev ? 'public/resources/mac/Miniconda3-latest-MacOSX-x86_64.sh' : 'installers/Miniconda3-latest-MacOSX-x86_64.sh');
    }

    else if (os === 'linux') {
      executablePath = (isDev ? 'public/resources/linux/Miniconda3-latest-linux-x86_64.sh' : 'installers/Miniconda3-latest-linux--x86_64.sh');
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

/* ipcMain.on('Conda_Script', (event, arg, arg1) => {

  console.log('conda script');

  var ExecuteOs;

  if (process.platform === 'win32') ExecuteOs = path.join('win', 'runDeid.bat');
  else ExecuteOs = path.join('scripts', 'deiden', 'linux', 'runDeid.sh');

  const exec = require('child_process');

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));
  console.log(Script_Path);
  var thePath = '/home/eneko/Projects/workflows_platform/electron/public/scripts/deiden/linux/runDeid.sh';
  const argv = [arg1, arg1 + 'output'];
  console.log(argv);


  exec.exec('sh', thePath, argv, (error, stdout, stderr) => {
    console.log(error);
    console.log(stdout);
    console.log(stderr);
  });
}) */

ipcMain.on('Conda_Script', (event, arg, arg1) => {
  console.log(process.env.SHELL);
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


  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));
  var prepare_path = (isDev ? path.join('scripts', 'deiden', PrepareConda) : path.join('Scripts', 'deiden', PrepareConda)); 
  console.log(Script_Path);

  const prepare = require('child_process').execFile(__dirname+'/'+prepare_path, {env: 'bin/bash'});

  prepare.stdout.on('data', (data) => {
    console.log (`data ${data}`)
  });

  prepare.stderr.on('data', (data) => {
    console.log('errdata', data);
  });

  prepare.on('exit', (data) => {
    console.log(`final data = ${data}`);
  })


  const argv = [arg1, arg1 + 'output'];
  console.log(argv);
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

ipcMain.on('CondaUpload', (event, arg) => {
  if (process.platform === 'win32') {
    ExecuteOs = path.join('win', 'uploadImages.bat');
  }
  else {
    ExecuteOs = path.join('linux', 'uploadImages.sh');
  }

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));

  const upload = require('child_process').execFile(`${__dirname}/${Script_Path}`, [arg]);

  upload.stdout.on('data', (data) => {
    console.log (`stdout data: ${data}`);
  });

  upload.stderr.on('data', (data) => {
    console.log (`stderr data: ${data}`);
  });

  upload.on('exit', (data) => {
    console.log (`final data: ${data}`);
  });

})
