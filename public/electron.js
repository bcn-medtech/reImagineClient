const electron = require('electron');
const { Menu, Tray } = require('electron')

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const { ipcMain } = require('electron');

let mainWindow;

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
  console.log(process.cwd());
  tray = new Tray('icons\\lung.png');
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
      label: 'Help',
      click: function () {
        console.log("Clicked on Help")
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

    fs.access(app.getAppPath()+"\\installers", fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        process.env["version"] = "prod"
      }
      else {
        process.env["version"] = "dev"
      }
    });
  }
});


ipcMain.on('Miniconda_Request', (event, arg) => {
  var Dir = null;
  
  console.log(process.env);

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

ipcMain.on('Miniconda_Install', (event, arg) => {
  var env = process.env["version"];
  console.log(arg);
  if (arg !== null) {
    console.log('Miniconda has been installed');

    var TotalPath = path.join(arg, 'python.exe');
    //var Script_Path = path.join(app.getAppPath(), 'Scripts', 'hello.py');)
    var Script_Path;
    //if (env === "dev") Script_Path =  path.join('public', 'scripts', 'hello.py');
    Script_Path = path.join('Scripts', 'hello.py');

    
    const deploySh = require('child_process').spawn(TotalPath,[Script_Path]);
    deploySh.stdout.on('data', (data) => {
      console.log(`data: ${data}`);
      event.sender.send('executed_Miniconda', data);
    });

    deploySh.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`)
    })
  }

  else {
    var os = process.platform;
    console.log(os);
    var executablePath;

    if (os == "win32") {

      //executablePath = 'public\\resources\\win\\Miniconda2-latest-Windows-x86_64.exe';
      executablePath = 'installers\\Miniconda2-latest-Windows-x86_64.exe';
    }
    else if (os == 'MacOS') {
      executablePath = 'public\resources\mac\Miniconda3-latest-MacOSX-x86_64.sh';
    }

    else if (os === 'linux') {
      executablePath = 'public\resources\linux\Miniconda3-latest-Linux-x86_64.sh';
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
