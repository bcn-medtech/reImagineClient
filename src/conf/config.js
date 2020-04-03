const path = require('path')
const os = require("os")

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

module.exports.CONSTANTS = CONSTANTS;
module.exports.minioCred = 'minio.json';
module.exports.requiredPrograms = requiredPrograms;
module.exports.installHints = installHints;