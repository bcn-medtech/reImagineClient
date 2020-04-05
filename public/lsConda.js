const path = require('path'); 
const fs = require('fs');
const os = require("os");
const exec = require('child_process'); 
const uuid = require("uuid")
const shell = require("shelljs") 
let config = require("../src/conf/config");
const CONSTANTS = config.CONSTANTS;

function doInstallRequest(event, app) {
  if (app.name === "conda") {
    if (fs.existsSync(CONSTANTS.INSTALLERS.CONDAPATH)) {
      return [true, "Conda already installed"]
    }    
    let [flag, res] = installMiniconda()  
    return [flag, res]
  } else {
    return [false, "Cannot install program "+app.name]
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
}
/*
function _execShellCommand(cmd, argv) {
  var stdOut = ""
  var std
  exec.execFile(cmd, argv)


}
*/
function runCondaAnonimizer(files, outDir,callback) {

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
  
  let res = 0;
  let resOut = "";
  let result=false;

  for( elem in files ){
    argv = [files[elem], outDir, PythonScript_Path];

    console.log("About to run:",Script_Path, argv);
    //const deploySh = _execShellCommand(Script_Path, argv)
    const deploySh = exec.execFile(Script_Path, argv);

    deploySh.stdout.on('data', (data) => {
      resOut += "Data: " + data + "\n"
      console.log(`Output: ${data}`);
      result={res:res,resOut:resOut,outDir:outDir};
      callback(result);
    });
  
    deploySh.stderr.on('data', (data) => {
      resOut += "Data: " + data + "\n"
      console.log(`stderr: ${data}`)
      res=-1
      result={res:res,resOut:resOut,outDir:outDir};
      callback(result);
    })
  
    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      resOut += "Data: " + data + "\n";
      res=1;
      result={res:res,resOut:resOut,outDir:outDir};
      callback(result);
    })          
  }
  
}


// Script to isntall program requested for, like miniconda
function installMiniconda(){
  // Set the installation path, check if exists, else install. THE RETURNS AREN'T IMPORTANT by now
  
    let isOk = false
    let reason = "Not implemented"

    var instCmd = null
    var instArgs = null
    var envScript = null
    if (process.platform === "win32") {
      instCmd = CONSTANTS.INSTALLERS.DEV_WIN, //(isDev ? CONSTANTS.INSTALLERS.DEV_WIN : CONSTANTS.INSTALLERS.WIN);
      instArgs = []
      envScript =  path.join('win32', 'createEnv.bat')
    }
    else if (process.platform === 'darwin') {
      instCmd = CONSTANTS.INSTALLERS.DEV_MAC, //(isDev ? CONSTANTS.INSTALLERS.DEV_MAC : CONSTANTS.INSTALLERS.MAC);  
      instArgs = ["-b", "-p "+CONSTANTS.INSTALLERS.CONDAPATH]
      envScript = path.join('linux', 'createEnv.sh')
    }
    else if (process.platform === 'linux') {
      instCmd = CONSTANTS.INSTALLERS.DEV_LIN //(isDev ? CONSTANTS.INSTALLERS.DEV_LIN : CONSTANTS.INSTALLERS.LIN),
      instArgs = ["-b", "-p "+CONSTANTS.INSTALLERS.CONDAPATH]
      envScript = path.join('linux', 'createEnv.sh')
    } else {
      isOk = false; reason="Unknown platform: "+process.platform
      return [isOk, reason]
    }

    envScript = path.join(__dirname, 'scripts', 'deiden', envScript);
    console.log("About to run:",instCmd, instArgs, envScript)

    var pInstall = exec.execFile(instCmd, instArgs)

    pInstall.stdout.on('data', (data) => {
      reason += "Data: " + data + "\n"
      console.log(`Output: ${data}`);
    });
  
    pInstall.stderr.on('data', (data) => {
      reason += "Data: " + data + "\n"
      console.log(`stderr: ${data}`)
    })
  
    pInstall.on('exit', (data) => {
      console.log(`final data ${data}`);
      reason += "Data: " + data + "\n"

      /*
        INSTALLING CONDA ENVIRONMENT!!!!!
      */
      console.log("Miniconda installed, now installing ENVIRONMENT")
      if (envScript) {

        console.log("About to run:",envScript, [])
  
        var pInstall = exec.execFile(envScript, [], { env: 'bin/bash' })
    
        pInstall.stdout.on('data', (data) => {
          reason += "Data: " + data + "\n"
          console.log(`Output: ${data}`);
        });
      
        pInstall.stderr.on('data', (data) => {
          reason += "Data: " + data + "\n"
          console.log(`stderr: ${data}`)
        })
      
        pInstall.on('exit', (data) => {
          console.log(`final data ${data}`);
          reason += "Data: " + data + "\n"
        
        })
      }

    })

    return [isOk, reason]
  
}

module.exports.installRequest = doInstallRequest;
module.exports.installChecks = doInstallChecks;
module.exports.runCondaAnonimizer = runCondaAnonimizer;

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
