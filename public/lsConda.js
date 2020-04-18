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
const util = require('util')
const execFile = util.promisify(exec.execFile)

async function doInstallRequestPromise( app ) {

  if (app.name === "conda") {
    if (fs.existsSync(config.scripts.condaPath)) {
      res = { status: true, reason: "Conda already installed" }
      return res
    } else {
      res = await _installMiniconda()
      return res 
    }
  } else if (app.name === "deiden") { 
    
      console.log("About to run:", config.scripts.condaInstallEnvScript, [config.scripts.condaPath])
      let options = {shell:false};
      try {
        let pInstall = execFile(config.scripts.condaInstallEnvScript, [config.scripts.condaPath], options)
        pInstall.child.stdout.on('data', data => {
          console.log("CONDA CREATE ENV stdout: ", data)
        })
    
        pInstall.child.stderr.on('data', data => {
          console.log("CONDA CREATE ENV stderr: ", data)
        })                
        await pInstall

        return {status: true, reason: "Completed successfully"}
    
      } catch ( error ) {
        return {status: false, reason: "Error while creating conda environment: "+ error.status + " " + error.message}
      }    
  
  } else {
        return { status: false, reason: "Installation of app " +app.name + " is not implemented" }
  }
  
}


async function _installMiniconda() {
  
  var instArgs = []
  
  if (process.platform === "win32") {
    instArgs = ["/InstallationType=JustMe","/RegisterPython=0","/S","/D="+ config.scripts.condaHome]
  }
  else if ( (process.platform === 'darwin') || (process.platform === 'linux')) {
    instArgs = ["-b", "-p " + config.scripts.condaHome]
  }
  else {
    res = {status: false, reason: "Unknown platform: " + process.platform}
    return res
  }

  console.info("About to run:", config.scripts.condaInstaller, instArgs)

  let options = {shell:false};
  try {
    let pInstall = execFile(config.scripts.condaInstaller, instArgs, options);
    pInstall.child.stdout.on('data', data => {
      console.log("INSTALLER stdout: ", data)
    })

    pInstall.child.stderr.on('data', data => {
      console.log("INSTALLER stderr: ", data)
    })
    await pInstall
    return {status: true, reason: "Installer completed successfully"}

  } catch ( error ) {
    return {status: false, reason: "Error in installer: "+ error.status + " " + error.message}
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

async function runCondaAnonimizer(files, outDir, callback) {

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

  for (elem in files) {
    argv = [files[elem], outDir, config.scripts.deidenScript, config.sqlFile, config.scripts.condaPath];

    console.log("About to run:", config.scripts.condaScript, argv);
    let options = {shell:false};
    try {
      const pInstall = execFile(config.scripts.condaScript, argv, options);
      pInstall.child.stdout.on('data', data => {
        console.log("ANONIMIZATION stdout: ", data)
      })
    
      pInstall.child.stderr.on('data', data => {
        console.log("ANONIMIZATION stderr: ", data)
      })                
      await pInstall
    
      return {status: true, reason: "Completed successfully", outDir: outDir}
    
    } catch ( error ) {
      return {status: false, reason: "Error while running anonimization: "+ error.status + " " + error.message, outDir: outDir}
    }    

  }

}

module.exports.installRequestPromise = doInstallRequestPromise;
module.exports.installChecks = doInstallChecks;
module.exports.runCondaAnonimizer = runCondaAnonimizer;




