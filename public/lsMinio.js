var tar = require('tar')
var minio = require('minio')
const fs = require("fs")
var tmp = require("tmp")
var path = require("path")
const os = require("os")
const config = require("./config")
const uuid = require("uuid")

function getMinioClient() {

  cfname = path.join(process.cwd(), config.minioCred)

  if (nex(cfname)) {
    console.log("Please configure minio credentials in "+cfname);
    return null;
  }
  let data = fs.readFileSync(cfname);
  let minioCred = JSON.parse(data);

  var minioClient = new minio.Client(minioCred);

  return minioClient;

}


function nex(fname) {
  try {
    if (!fs.existsSync(fname)){
      console.log("Path "+fname+" does not exist!");
      return true;
    } else {
      //console.log("Path "+fname+" exists!");
      return false;
    }
  } catch(err) {
    console.error(err)
  }
}

// uploading of images deidentificated for deid script
function doMinioUpload(baseName, tmpDir) {

  if (!tmpDir) tmpDir = tmp.dirSync();
  console.log('Temporary dir: '+tmpDir.name);  
  if (nex(tmpDir.name)) return false;

  console.log('Selected for upload: '+baseName);
  console.log(typeof baseName);
  if (nex(baseName)) return false;

  var cwd = path.dirname(baseName);
  var dirName = path.basename(baseName);  
  console.log('Packing ' + dirName)  
  console.log('Relative to: ' + cwd)
  
  console.log('Starting packing files for upload...');

  var fname = path.join(tmpDir.name, uuid.v4()+'.tgz');
  console.log('Creating temporary file in: ' + fname)

  try {
    tar.c( {gzip: true, file: fname, sync: true, C: cwd },
            [dirName]
    );
  } catch (err) {
    console.log("Encountered an error in creating tar file: "+err)
    return false;
  }
  if (nex(fname)) return false;

  console.log('Connecting to minio client...');

  let minioClient = getMinioClient();
  if (minioClient === null) {
    console.log("Cannot create minio client. Maybe credential file is missing?");
    return false
  }
  
  metaData = {
    'Content-Type': 'application/octet-stream'
  }

  var upfname = path.basename(fname);
  var bucket = 'fetal';

  try {
    minioClient.fPutObject(bucket, upfname, fname, metaData, (err, etag) => {
        if (err) {
          console.log("Error in uploading file!"+err);
          return false;
        } 
        console.log("Upload successfull!");
        fs.unlinkSync(fname);
        tmpDir.removeCallback();
      });
  } catch(err) {
    console.error(err)
  }

  return true;
  
};


module.exports.minioUpload = doMinioUpload;

