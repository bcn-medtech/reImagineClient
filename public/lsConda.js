const path = require('path');
const fs = require('fs');
const os = require("os");
const exec = require('child_process');
const uuid = require("uuid")
const shell = require("shelljs")
const isDev = require('electron-is-dev');
const main = require("./electron.js")
const config = main.getConfig();
shell.config.execPath = shell.which('node').toString()
//const CONSTANTS = config.CONSTANTS;

function doInstallRequest(event, app, callback) {
  if (app.name === "conda") {
    if (fs.existsSync(config.scripts.condaPath)) {
      //return [true, "Conda already installed"]
      callback({ isOk: true, res: "Conda already installed" });
    } else {
      installMiniconda((result)=>{
        callback({ isOk: result.isOk, res: result.reason });
      });
      //return [flag, res]
    }
  } else if (app.name === "deiden") {
    console.log("Miniconda installed, now installing ENVIRONMENT")  
    let reason = ""
    var pInstall = createDeidEnv()

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
      reason += "Data: " + data + "\n";
      isOk=true;
      callback({isOk:isOk, res: reason});
    })
  
  } else {
    //return [false, "Cannot install program " + app.name]
    callback({ isOk:false, res: res});
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
    res.push({ "name": p.name, "err": _e })
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

  let condaPath = null
  if (program === "conda") {
    let condaPath = shell.env["CONDA_EXE"]
    if (!condaPath) {
      for (const _p of hints) {
        if (fs.existsSync(_p)) {
          condaPath = _p
          break
        }
      }
    }

    if (!condaPath) {
      condaPath = shell.which(program);
    }

    if (!condaPath) {
      errs.push("Cannot find " + program)
      return errs
    } else {
      console.log(program, "path: ", condaPath)
      config.scripts.condaPath = condaPath;
      config.scripts.condaHome = path.resolve(condaPath, "..", "..")
      return []
    }
  }

  let foundDeid = false;
  if (program === "deiden") {
    /*
    let cmd = "source " + path.join(config.scripts.condaPath,"bin","activate") + 
      " && conda env list | grep deid"
    console.log("About to run: ", cmd)
    try {
      var out = shell.exec(cmd,{silent:true}).stdout
      foundDeid = out.startsWith("deid");
    } catch (e) {
      console.error(out, e)
      errs.push([out, e])
    }
    */
   for (const _p of hints) {
    let _dp = path.join(config.scripts.condaHome, _p)
    console.log("Searching deid in ", _dp)

    if (fs.existsSync(_dp)) {
      foundDeid = true
      break
      }
    }

    if (!foundDeid) {
      errs.push("Cannot find " + program)
      return errs
    }

  }

  return []
}
/*
function _execShellCommand(cmd, argv) {
  var stdOut = ""
  var std
  exec.execFile(cmd, argv)


}
*/
function runCondaAnonimizer(files, outDir, callback) {

  if (!outDir) {
    outDir = config.anDir
  }

  //Add a unique uuid for run
  outDir = path.join(outDir, uuid.v4());

  console.log("Starting anonimization process");
  console.log("Files", files)
  console.log("outDir", outDir)

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true })
  }

  let argv;

  let res = 0;
  let resOut = "";
  let result = false;

  for (elem in files) {
    argv = [files[elem], outDir, config.scripts.deidenScript, config.sqlFile, config.scripts.condaPath];

    console.log("About to run:", config.scripts.condaScript, argv);
    //const deploySh = _execShellCommand(Script_Path, argv)
    const deploySh = exec.execFile(config.scripts.condaScript, argv);

    deploySh.stdout.on('data', (data) => {
      resOut += "Data: " + data + "\n"
      console.log(`Output: ${data}`);
      result = { res: res, resOut: resOut, outDir: outDir };
      callback(result);
    });

    deploySh.stderr.on('data', (data) => {
      resOut += "Data: " + data + "\n"
      console.log(`stderr: ${data}`)
      res = -1
      result = { res: res, resOut: resOut, outDir: outDir };
      callback(result);
    })

    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      resOut += "Data: " + data + "\n";
      res = 1;
      result = { res: res, resOut: resOut, outDir: outDir };
      callback(result);
    })
  }

}


// Script to isntall program requested for, like miniconda
function installMiniconda(callback) {
  // Set the installation path, check if exists, else install. THE RETURNS AREN'T IMPORTANT by now

  let isOk = false
  let reason = "Not implemented"

  var instCmd = config.scripts.condaInstaller
  var instArgs = []
  
  if (process.platform === "win32") {
    instArgs = []
  }
  else if (process.platform === 'darwin') {
    instArgs = ["-b", "-p " + config.scripts.condaPath]
  }
  else if (process.platform === 'linux') {
    instArgs = ["-b", "-p " + config.scripts.condaPath]
  } else {
    isOk = false; reason = "Unknown platform: " + process.platform
    callback({isOk:isOk, reason:reason});
  }

  console.log("About to run:", instCmd, instArgs)

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
  
    console.log("Miniconda installed, now installing ENVIRONMENT")  

    var pInstall = createDeidEnv()

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
      reason += "Data: " + data + "\n";
      isOk=true;
      callback({isOk:isOk, reason:reason});
    })
  */

  })
}

function createDeidEnv() {
  console.log("About to run:", config.scripts.condaInstallEnvScript, [config.scripts.condaPath])

  var pInstall = exec.execFile(config.scripts.condaInstallEnvScript, [config.scripts.condaPath], { env: 'bin/bash' })

  return pInstall
}

module.exports.installRequest = doInstallRequest;
module.exports.installChecks = doInstallChecks;
module.exports.runCondaAnonimizer = runCondaAnonimizer;




