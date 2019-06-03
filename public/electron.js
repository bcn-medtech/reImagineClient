const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isDev = require('electron-is-dev');

const path = require('path');
const url = require('url');

const {ipcMain} = require('electron');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600, webPreferences: {webSecurity: false}});
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


ipcMain.on('request-mainprocess-action', (event, arg) => {

    console.log("Hola");


    // Displays the object sent from the renderer process:
    //{
    //    message: "Hi",
    //    someData: "Let's go"
    //}
    console.log(
        arg
    );

    event.sender.send('mainprocess-response',arg);
});

ipcMain.on('execute-python', (event,arg) => {
    console.log(process.platform);
    console.log('python script');
    const {spawn} = require('child_process');
    var path = require('path');
    if (arg === 'hello') {
        var basepath = app.getAppPath();
        console.log(`app root: ${basepath}`);
        // for production mode
        //var x = path.join(basepath, '..', '..', 'public', 'scripts', 'hello.py');
        // for dev mode
        var x = path.join(basepath, 'public', 'scripts', 'hello.py');
        var pyx = path.join("c:", 'Users', 'signe', 'Miniconda2','python.exe');
        console.log(`python script is at: ${x}`);
        //const deploySh = spawn('cmd.exe', ["/C", "C:\Users\signe\Miniconda2\Scripts\activate.bat", "C:\Users\signe\Miniconda2", "e", "print('f')"],);
        const proces = spawn(pyx,[x]);
        proces.stdout.on('data',(data) => {
            console.log(`data: ${data}`);
            event.sender.send('executed-response',data);
        });
        proces.stderr.on('data', (data) => {
            console.log(data.toString());
          });
          
        proces.on('exit', (code) => {
         console.log(`Child exited with code ${code}`);
        });
    }
})