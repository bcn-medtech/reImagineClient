const electron = require('electron');
const { Menu, Tray } = require('electron')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const { ipcMain } = require('electron');

let mainWindow;
console.log(isDev, 'isDev');

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
  tray = new Tray(isDev ? 'public\\resources\\icons\\lung.png' : 'icons\\lung.png');
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


ipcMain.on('Files_to_Anonimize', (event,arg) => {
  console.log(arg);
})


ipcMain.on('Miniconda_Request', (event, arg) => {
  var Dir = null;
  
  //console.log(process.env);

  const fs = require('fs')
  const GetInfo = require('os');

  var user = GetInfo.userInfo().username;

  const Path = `C:\\Users\\${user}\\Miniconda2`;

  fs.access(Path, fs.F_OK, (err) => {
    if (err) {
      console.error(err);
      event.sender.send('RequestSol', null)
    }
    else {
      event.sender.send('RequestSol', Path);
    }
  });
});

ipcMain.on('Miniconda_Install', (event, arg, arg1) => {
  console.log('hi');
  const ProgressBar = require('electron-progressbar');
  console.log(arg1, 'latest argument with list of folders');

  //console.log(arg);
  if (arg !== null) {
    console.log('Miniconda has been installed');


    //var Script_Path = path.join(app.getAppPath(), 'Scripts', 'hello.py');)
    var Script_Path = (isDev ? path.join('public', 'scripts', 'deiden', 'runDeid.bat') : path.join('Scripts', 'deiden', 'runDeid.bat'));
    
    //const deploySh = require('child_process').spawn(Script_Path, ['C:\\Users\\signe\\Desktop\\patients\\16b32e13-07fa866e-71e2e7b0-62679778-1083b5f4', 'C:\\Users\\signe\\Desktop\\patients\\TestOutput']);
    const argv = [arg1, arg1+'output'];
    const deploySh = require('child_process').execFile(Script_Path, argv);
    var progressBar = new ProgressBar({
      text: 'Preparing files to deid',
      detail: 'Wait...'
    });

    progressBar.on('aborted', () => {
      console.info('aborted...');
    })

    deploySh.stdout.on('data', (data) => {
      console.log(`data for script: ${data}`);
      //event.sender.send('executed_Miniconda', data);      
    });

    deploySh.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })

    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      progressBar.setCompleted();
      event.sender.send('finished_deid', argv[0]);
    })
  }

  else {
    var os = process.platform;
    var executablePath;

    if (os == "win32") {

      executablePath = (isDev ? 'public\\resources\\win\\Miniconda2-latest-Windows-x86_64.exe' : 'installers\\Miniconda2-latest-Windows-x86_64.exe');
    }
    else if (os == 'MacOS') {
      
      executablePath = (isDev ? 'public\resources\mac\Miniconda3-latest-MacOSX-x86_64.sh' : 'installers/Miniconda3-latest-MacOSX-x86_64.sh');
    }

    else if (os === 'linux') {
      executablePath = (isDev ? 'public\resources\linux\Miniconda3-latest-MacOSX-x86_64.sh' : 'installers/Miniconda3-latest-linux--x86_64.sh');
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
