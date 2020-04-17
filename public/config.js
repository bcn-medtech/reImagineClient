const path = require('path')
const os = require("os")
const isDev = require('electron-is-dev');
const {app} = require("electron")
const fs = require('fs');

const confDir = path.join(app.getPath("documents"),"reimagine")
const confFile = path.join(confDir, "reImagine.json");
const sqlFile = path.join(confDir, "patients.sqlite");
const logDir = path.join(confDir, "logs");
const anDir = path.join(confDir, "an");

const _createDirs = [confDir, logDir, anDir]

const requiredPrograms = [
    {name: "conda", icon: "../assets/logo_anaconda.png"},
    {name: "deiden", icon: "../assets/logo_anaconda.png"},
  ]

const installHints = {
    conda: [
        path.join(os.homedir(), "miniconda3", "bin", "activate"),
        path.join(os.homedir(), "anaconda3", "bin", "activate"),
    ],
    deiden: [
        path.join("envs","deid")
    ]
}

function getCondaInstaller() {
    let sPath = 'installers';
    if (isDev) {
    // I don't know why process.json uses mac and node uses darwin here!! :(
        let plat = process.platform
        if (plat === 'darwin') {
            plat = "mac"
        }
        if (plat === 'win32') {
            plat = "win"
        }        
        sPath = path.join(app.getAppPath(), sPath, plat)
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
        // I don't know why process.json uses mac and node uses darwin here!! :(
        let plat = process.platform
        if (plat === 'darwin') {
            plat = "mac"
        }
        if (plat === 'win32') {
            plat = "win"
        }        
        sPath = path.join(sPath, plat)
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
    condaHome: path.join(os.homedir(),"miniconda3"),
    condaPath: path.join(os.homedir(),"miniconda3","bin","activate")
}

// Ensure basic dir structure is ready
for (_d of _createDirs) {
    if (!fs.existsSync(_d)) {
        fs.mkdirSync(_d, { recursive: true })
    }
}

module.exports.confDir = confDir
module.exports.confFile = confFile;
module.exports.sqlFile = sqlFile;
module.exports.anDir = anDir;
module.exports.logDir = logDir;
module.exports.minioCred = path.join(confDir, "minio.json");
module.exports.requiredPrograms = requiredPrograms;
module.exports.installHints = installHints;
module.exports.scripts = scripts;

