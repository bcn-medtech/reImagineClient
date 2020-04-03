const path = require('path'); 
const fs = require('fs');
const os = require("os");
const exec = require('child_process'); 
const uuid = require("uuid")
const shell = require("shelljs") 
let config = require("../src/conf/config");
const CONSTANTS = config.CONSTANTS;

function doInstallRequest(event, arg) {
  console.log('install request action');
  // De momento cada SO tiene un modo de lectura de archivos, pero en principio no hace falta
  if (process.platform == 'win32') {
    console.log('hola windows');
    let flag
    if(arg[0] === "conda"){
      flag = installMiniconda()
      event.returnValue = flag
    }else{
      event.returnValue = false;
    }
  } else {
    console.log('OS Unix');
    var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
    var SearchUbi = path.join('scripts', ExecuteOs);
    //Check if program is installed
    exec.execFile(__dirname + '/' + SearchUbi, [arg], (err, stdout, stderr) => {
      if (err){
        console.log("err")
        throw err;
      }
      if (typeof stdout === 'string'){
        //When program not found, stdout=\n
        if(stdout.toString() !== '\n'){
          event.returnValue = true; //Already installed
        }else{
          //If not installed, install conda. Not prepared for others
          if(arg == 'conda'){
            let flag = installMiniconda()
            event.returnValue = flag
          }else{
            event.returnValue = false;
          }
        }
      }
    })
  }
}

function doInstallChecks(programs) {
  var res = []
  for (var p of programs) {
    let hints = []
    if (config.installHints.hasOwnProperty(p.name)) {
      hints = config.installHints[p.name]
    }
    //hints.concat([userHints])
    _e = doInstallCheck(p.name, hints)
    res.push({"name":p.name, "err":_e})
  }

  return res;
}

/*
  Instead of checking in the entire fs, just let the user configure the path
*/
function doInstallCheck(program, hints) {

  console.log("Checking install status of program ", program);  
  console.log("Provided hints: ", hints);  
  let errs = []

  if (!program) {
    return ["Cannot check a null program name!"]
  }

  let pPath = shell.which(program);
  if (!pPath) {
    for (const _p of hints) {
      if (fs.existsSync(_p)){
        pPath = _p
        break
      }
    }
  }

  if (!pPath) {
    errs.push("Cannot find "+program)
    return errs
  }

  console.log(program, "path: ", pPath)
  return []

  /*
  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = path.join('scripts', ExecuteOs)
  if (process.platform == 'win32') {
    exec.execFile(__dirname + '/' + SearchUbi, [arg], (err, stdout, stderr) => {
      if (err){
        console.log("ERR" + err)
        event.returnValue = false
      }else{
        console.log("StdOut: ",stdout);
        console.log("StdErr: ",stderr);
        event.returnValue = true
      }
    });
  }else{
    if(arg[0] === "conda"){
      const homedir = require('os').homedir();
      let condaPath = CONSTANTS.INSTALLERS.CONDAPATH.replace("$HOME", homedir);
      if (fs.existsSync(condaPath)) {
        console.log("Conda already installed");
        event.returnValue = true;
      }else{
        event.returnValue = false;
      }
    }else {
      event.returnValue = false;
    }
  }
  */
}
/*
function _execShellCommand(cmd, argv) {
  
  exec.execFile(cmd, argv)


}
*/
function runCondaAnonimizer(files, outDir) {

  if (!outDir) {
    outDir = path.join(os.homedir(), "Documents/reimagine/an")
  }

  //Add a unique uuid for run
  outDir = path.join(outDir, uuid.v4());

  console.log("Starting anonimization process");  
  console.log("Files", files)
  console.log("outDir", outDir)

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, {recursive: true})
  }
    
  var Script_Path = getRunDeidPath()
  var PythonScript_Path = getDeidTestPath()
  let argv;
  
  let res = false;
  let resOut = "";

  for( elem in files ){
    argv = [files[elem], outDir, PythonScript_Path];

    console.log("About to run:",Script_Path, argv);
    
    //const deploySh = _execShellCommand(Script_Path, argv)
    const deploySh = exec.execFile(Script_Path, argv);

    deploySh.stdout.on('data', (data) => {
      resOut += "Data: " + data + "\n"
      console.log(`Output: ${data}`);
    });
  
    deploySh.stderr.on('data', (data) => {
      resOut += "Data: " + data + "\n"
      console.log(`stderr: ${data}`)
    })
  
    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      resOut += "Data: " + data + "\n"
    })      


    return [res, resOut, outDir]
    
  }
  
}

// Script to isntall program requested for, like miniconda
function installMiniconda(){
  // Set the installation path, check if exists, else install. THE RETURNS AREN'T IMPORTANT by now
  const homedir = require('os').homedir();
  let condaPath = CONSTANTS.INSTALLERS.CONDAPATH.replace("$HOME", homedir);
  let PrepareConda;
  if (fs.existsSync(condaPath)) {
    console.log("Conda already installed");
    return true;
  }else{
    var os = process.platform;
    var executablePath;
    if (os == "win32") {
      executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_WIN : CONSTANTS.INSTALLERS.WIN);
      PrepareConda = path.join('win32', 'createEnv.bat');
      exec.execFile(__dirname + "/" + executablePath, (err, stdout, stderr) => {
        if (err){
          console.log("err")
          throw err;
        }
        console.log("StdOut: "+stdout.toString()+".");
        console.log("StdErr: ",stderr);
        createEnvExecute(PrepareConda);
        //alert("Reboot your PC to complete the installation.")
      })
      return true;
    }
    else if (os == 'MacOS') {
      executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_MAC : CONSTANTS.INSTALLERS.MAC);
      return exec.execFile(executablePath, ["-b", "-p "+CONSTANTS.INSTALLERS.CONDAPATH], function (err, data) {
        if (err) {
          console.error("Installation error", err);
          return false;
        }
        console.log('Miniconda has been installed');
        console.log("Installation Output: ", data.toString());
        createEnvExecute(PrepareConda);
        return true;
      });
    }
    else if (os === 'linux') {
      executablePath = (isDev ? CONSTANTS.INSTALLERS.DEV_LIN : CONSTANTS.INSTALLERS.LIN);
      PrepareConda = path.join('linux', 'createEnv.sh');
      return exec.execFile(executablePath, ["-b", "-p "+CONSTANTS.INSTALLERS.CONDAPATH], function (err, data) {
        if (err) {
          console.error("Installation error", err);
          return false;
        }
        console.log('Miniconda has been installed');
        console.log("Installation Output: ", data.toString());
        createEnvExecute(PrepareConda);
        return true;
      });
    }
  }
}

module.exports.installRequest = doInstallRequest;
module.exports.installChecks = doInstallChecks;
module.exports.runCondaAnonimizer = runCondaAnonimizer;

function createEnvExecute(PrepareConda){
  var child = exec.execFile;
  var Promise = require('bluebird');
  function promiseProcess(prog) {
    return new Promise(function (resolve, reject) {
      prog.addListener('error', reject);
      prog.addListener('exit', resolve);
    })
  }

  var prepare_path = path.join('scripts', 'deiden', PrepareConda);
  const prepare = child(__dirname + '/' + prepare_path, { env: 'bin/bash' });

  promiseProcess(prepare).then(function (result) {
    console.log('promise complete: ' + result);
  }, function (err) {
    console.log('promise rejected: ' + err);
  });
  prepare.stdout.on('data', (data) => {
    console.log(`data ${data}`)
  });

  prepare.stderr.on('data', (data) => {
    console.log('errdata', data);
  });

  prepare.on('exit', (data) => {
    console.log(`final data = ${data}`);
  })
}

function getRunDeidPath(){
  var ExecuteOs;
  if (process.platform === 'win32') {
    ExecuteOs = path.join('win32', 'runDeid.bat');
  } else {
    ExecuteOs = path.join('linux', 'runDeid.sh');
  }
  var Script_Path = path.join(__dirname, 'scripts', 'deiden', ExecuteOs);
  return Script_Path
}

function getDeidTestPath(){
  //let file = (isDev ? path.join(__dirname, 'scripts', 'deiden', 'src', 'deidTest_pyd.py') : path.join(__dirname,"..", "..", "..", 'Scripts', 'deiden', 'src', 'deidTest_pyd.py'));
  let file = path.join(__dirname, 'scripts', 'deiden', 'src', 'deidTest_pyd.py');  
  return file;
}
