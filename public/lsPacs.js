function doPacsRequest(event, arg) {
  var uri = '';
  var opts = {
    // Put CRUD method needed → method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(data),
    // if have cors or no-cors → mode: ''
    cache: 'default'

  };
  var data = {};
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Authorization', token);

  let request = new request(url, opts);

  return fetch(request).then((response) => {
    if (response.type === "json") {
      return response.json;
    }
    else {
      throw new Error("Request error, Unsupported data " + arg);
    }
  })
}

// uploading of images deidentificated for deid script
function doPacsUpload(event, arg, arg1) {
  let port = arg1;
  let file;
  if(!fs.existsSync(arg)){
    file = getOutputPath()
  }else{
    file = arg;
  }
  let imagePaths = getFilesFromDir(file, [".dcm"])
  console.log(imagePaths)
  console.log('conda upload');
  console.log("Port", port)
  console.log("Files: ",imagePaths);
  /* horizontal bar, pacs selector before send orthanc button  */
  if (process.platform === 'win32') {
    ExecuteOs = path.join('win32', 'uploadImages.bat');
  } else {
    ExecuteOs = path.join('linux', 'uploadImages.sh');
  }

  var Script_Path = (isDev ? path.join('scripts', 'deiden', ExecuteOs) : path.join('scripts', 'deiden', ExecuteOs));
  for (image in imagePaths){
    const upload = exec.execFile(__dirname + '/' + Script_Path, [imagePaths[image], port]);

    upload.stdout.on('data', (data) => {
      console.log(`stdout data: ${data}`);
    });
    upload.stderr.on('data', (data) => {
      console.log(`stderr data: ${data}`);
    });
    upload.on('exit', (data) => {
      console.log(`final data: ${data}`);
    });
  }
};


module.exports.pacsRequest = doPacsRequest;
module.exports.pacsUpload = doPacsUpload;

function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);      
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile);
      } else if (fs.statSync(curFile).isDirectory()) {
       walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  return filesToReturn; 
}

