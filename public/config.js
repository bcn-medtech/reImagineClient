const CONSTANTS = {};

CONSTANTS.INSTALLERS = {};
CONSTANTS.INSTALLERS.WIN = 'installers\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.LIN = 'installers/Miniconda3-latest-Linux--x86_64.sh';
CONSTANTS.INSTALLERS.MAC = 'installers/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_WIN = 'resources\\win32\\Miniconda2-latest-Windows-x86_64.exe';
CONSTANTS.INSTALLERS.DEV_LIN = 'public/resources/linux/Miniconda3-latest-Linux-x86_64.sh';
CONSTANTS.INSTALLERS.DEV_MAC = 'public/resources/mac/Miniconda3-latest-MacOSX-x86_64.sh';
CONSTANTS.INSTALLERS.CONDAPATH = "$HOME/miniconda3";

module.exports.CONSTANTS = CONSTANTS;
module.exports.minioCred = 'minio.json';