const path = require('path')
const os = require("os")
const isDev = require('electron-is-dev');
const {app} = require("electron")

const requiredPrograms = [
    {name: "conda", icon: "../assets/logo_anaconda.png"}
  ]

const installHints = {
    conda: [
        path.join(os.homedir(), "miniconda3", "bin", "activate"),
        path.join(os.homedir(), "anaconda3", "bin", "activate"),

    ]
}

function getCondaInstaller() {
    let sPath = 'installers';
    if (isDev) {
        sPath = path.join(app.getAppPath(), sPath, process.platform)
    } else {
        sPath = path.join(process.resourcesPath, sPath)
    }

    if (process.platform === 'win32') {
        sPath = path.join(sPath, 'Miniconda3-latest-Windows-x86_64.exe');
    } else if (process.platform === 'linux') {
        sPath = path.join(sPath, 'Miniconda3-latest-Linux-x86_64.sh');
    } else if (process.platform === 'darwin') {
        sPath = path.join(sPath, 'Miniconda3-latest-MacOSX-x86_64.sh');
    } else {
        console.log("Platform not supported! "+process.platform)
    }


    return sPath    
}

function getScriptDir() {

    let sPath = 'scripts';
    if (isDev) {
        sPath = path.join(app.getAppPath(), sPath)
    } else {
        sPath = path.join(process.resourcesPath, sPath)
    }

    return sPath
}

function getPlatformDir() {
    let sPath = getScriptDir()

    if (isDev) {
        sPath = path.join(sPath, process.platform)
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


function getCondaInstallEnvScript() {
    let sPath = getPlatformDir()
    
    if (process.platform === 'win32') {
        sPath = path.join(sPath, 'createEnv.bat');
    } else {
        sPath = path.join(sPath, 'createEnv.sh');
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
    condaInstallEnvScript: getCondaInstallEnvScript(),
    condaInstaller: getCondaInstaller(),
    condaPath: path.join(os.homedir(),"miniconda3")

}

module.exports.minioCred = 'minio.json';
module.exports.requiredPrograms = requiredPrograms;
module.exports.installHints = installHints;
module.exports.scripts = scripts;
module.exports.confDir = path.join(app.getPath("documents"),"reimagine")