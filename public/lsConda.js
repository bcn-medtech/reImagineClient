
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
    var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('scripts', ExecuteOs));
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

function doInstallCheck(event, arg) {
  var ExecuteOs = (process.platform === 'win32' ? ExecuteOs = 'searcher.bat' : 'searcher.sh');
  var SearchUbi = (isDev ? path.join('scripts', ExecuteOs) : path.join('scripts', ExecuteOs));
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
}


function doCondaScript(event, arg1, arg2) {
  //console.log(process.env.SHELL);
  console.log("Arg2", arg2)
  console.log("Arg1", arg1)
  console.log('Conda_script');
  
  var Script_Path = getRunDeidPath()
  var PythonScript_Path = getDeidTestPath()
  let argv;
  let files = arg1
  for( elem in files ){
    if(fs.existsSync(arg2)){
      argv = [files[elem], arg2, PythonScript_Path];
    }else{
      argv = [files[elem], getOutputPath() , PythonScript_Path];
    }
    console.log(argv);
    
    let ret = Script_Path;
    const deploySh = exec.execFile(Script_Path, argv);
    deploySh.stdout.on('data', (data) => {
      ret += "Data: " + data + "\n"
      console.log(`Output: ${data}`);
    });

    deploySh.stderr.on('data', (data) => {
      ret += "Data: " + data + "\n"
      console.log(`stderr: ${data}`)
    })

    deploySh.on('exit', (data) => {
      console.log(`final data ${data}`);
      ret += "Data: " + data + "\n"
      event.returnValue = ret;
    })
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
module.exports.installCheck = doInstallCheck;
module.exports.condaScript = doCondaScript;

