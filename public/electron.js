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
  tray = new Tray(isDev ? path.join('public','resources','icons','lung.png') : path.join('icons', 'lung.png'));
  const trayMenuTemplate = [
    {
      label: 'Open in browser',
      click: function () {
        console.log("Clicked on Open")
      }
    }, {
      label: 'Settings',
      click: function () {
        console.log("Clicked on settings")
      }
    }, {
      label: '3rdPart Installers',
      click: function () {
        mainWindow.loadURL(isDev ? 'http://localhost:3000/installers' : `file://${path.join(__dirname, '../build/index.html#/installers')}`);
      }
    }, {
      label: 'Logout',
      click: function () {
        app.quit()
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
    app.quit()
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
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('Scripts',ExecuteOs));

  console.log(ExecuteOs);
  console.log(SearchUbi);
  console.log(arg, 'plane arg');
  console.log(arg[0], 'point arg');
  console.log(__dirname, '__dirname');

  var exec = require('child_process');
  exec.execFile(SearchUbi, [arg], (error, stdout, stderr) => {
    if (error) throw error;
    console.log(stderr, 'stderr');
    console.log(stdout);
  });
  console.log('hola');

  /*
    var child = require('child_process').execFile;
    child(somePath, (err,data) => {
      if (err) {
        console.log(err);
        return;
      }
     console.log(data.toString());
   })
*/


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
     fs.readFile(`public\\scripts\\tmp\\${arg}.txt`, 'utf-8', (err,data) => {
       console.log(data);
       event.sender.send('InstallAnswer', data);
     })
    }
  })
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


ipcMain.on('Conda_Script', (event,arg, arg1) => {
  console.log('Conda_script');
  /* const ProgressBar = require('electron-progressbar'); */
  var ExecuteOs;

    if (process.platform === 'win32') ExecuteOs = path.join('win' ,'runDeid.bat');
    else ExecuteOs = path.join('linux','runDeid.sh');


    var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('Scripts', 'deiden', ExecuteOs));
    console.log(Script_Path);

    const argv = [arg1, arg1+'output'];
    console.log(argv);
    const deploySh = require('child_process').execFile(Script_Path, argv);

    /* var progressBar = new ProgressBar({
      text: 'Preparing files to deid',
      detail: 'Wait...'
    });

    progressBar.on('aborted', () => {
      console.info('aborted...');
    }) */

    deploySh.stdout.on('data', (data) => {
      console.log(`data for script: ${data}`);
    });

    deploySh.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      /* progressBar.setCompleted(); */
      event.sender.send('finished_deid', argv[0]);
    })
});
