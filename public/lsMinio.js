// uploading of images deidentificated for deid script
function doMinioUpload(event, arg, arg1) {
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


module.exports.minioUpload = doMinioUpload;

