const path = require('path')
const os = require("os")
const isDev = require('electron-is-dev');
const {app} = require("electron")

const CONSTANTS = {};

CONSTANTS.INSTALLERS = {};
CONSTANTS.INSTALLERS.WIN = path.join("installers",'Miniconda2-latest-Windows-x86_64.exe')
CONSTANTS.INSTALLERS.LIN = path.join("installers",'Miniconda3-latest-Linux--x86_64.sh');
CONSTANTS.INSTALLERS.MAC = path.join("installers",'Miniconda3-latest-MacOSX-x86_64.sh');
CONSTANTS.INSTALLERS.DEV_WIN = path.join("resources",'win32','Miniconda2-latest-Windows-x86_64.exe');
CONSTANTS.INSTALLERS.DEV_LIN = path.join("public",'resources','linux','Miniconda3-latest-Linux-x86_64.sh');
CONSTANTS.INSTALLERS.DEV_MAC = path.join("public",'resources','mac','Miniconda3-latest-MacOSX-x86_64.sh');
CONSTANTS.INSTALLERS.CONDAPATH = path.join(os.homedir(),"miniconda3");

const requiredPrograms = [
    {name: "conda", icon: "../assets/logo_anaconda.png"}
  ]

const installHints = {
    conda: [
        path.join(os.homedir(), "miniconda3", "bin", "activate"),
        path.join(os.homedir(), "anaconda3", "bin", "activate"),

    ]
}

function getScriptDir() {

    let sPath = path.join('public', 'scripts');
    if (isDev) {
        sPath = path.join(app.getAppPath(), sPath)
    } else {
        sPath = path.join(app.getAppPath(), "..", sPath)
    }

    return sPath
}

function getPlatformDir() {
    let sPath = getScriptDir()

    if (process.platform === 'win32') {
        sPath = path.join(sPath, 'win32');
    } else {
        sPath = path.join(sPath, 'linux');
    }

    return sPath

}

function getCondaScript() {
    let sPath = getPlatformDir()
    
    if (process.platform === 'win32') {
        sPath = path.join(sPath, 'runDeid.bat');
    } else {
        sPath = path.join(sPath, 'runDeid.sh');
    }

    return sPath

}


function getDeidenScript() {
    let sPath = path.join(getScriptDir(), 'deiden', 'src', 'deidTest_pyd.py');

    return sPath

}

const scripts = {
    scriptDir: getScriptDir(),
    platformDir: getPlatformDir(),
    condaScript: getCondaScript(),
    deidenScript: getDeidenScript(),

}

module.exports.CONSTANTS = CONSTANTS;
module.exports.minioCred = 'minio.json';
module.exports.requiredPrograms = requiredPrograms;
module.exports.installHints = installHints;
module.exports.scripts = scripts;
module.exports.confDir = path.join(app.getPath("documents"),"reimagine")