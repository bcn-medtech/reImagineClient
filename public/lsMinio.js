var tar = require('tar')
var minio = require('minio')
const fs = require("fs")
var tmp = require("tmp")
var path = require("path")
const os = require("os")
const uuid = require("uuid")
const main = require("./electron.js")
const config = main.getConfig();
const { lambdaInvoke }= require('./lambdaInvoke');

function getMinioClient() {

  cfname = config.minioCred

  if (nex(cfname)) {
    console.log("Please configure minio credentials in "+cfname);
    return null;
  }
  let data = fs.readFileSync(cfname);
  let minioConf = JSON.parse(data);

  var minioCred = minioConf.credentials
  var bucket = minioConf.bucket
  var minioClient = new minio.Client(minioCred);

  return [bucket, minioClient];

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
//legge i PID and ANONCODE salvati in un JSON in tmp
// async function readAccessionNumberAndAnoncodeInJsonTmp() {
//   const filePath = path.join(os.tmpdir(), 'anoncode_and_accessionNumber.json');
//   try {
//     const data = await fs.promises.readFile(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     console.error(error);
//     return null;
//   }
// }
// uploading of images deidentificated for deid script
async function doMinioUpload(baseName, tmpDir,callback) {

  if (!tmpDir) tmpDir = tmp.dirSync();
  console.log('Temporary dir: '+tmpDir.name);  
  if (nex(tmpDir.name)){
    callback(false);
  };

  console.log('Selected for upload: '+baseName);
  console.log(typeof baseName);
  if (nex(baseName)){
    callback(false);
  };

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
    callback(false);
  }
  if (nex(fname)){
    callback(false);
  };

  console.log('Connecting to minio...');

  let [bucket, minioClient] = getMinioClient();
  if (minioClient === null) {
    console.log("Cannot create minio client. Maybe credential file is missing?");
    callback(false);
  }
  
  metaData = {
    'Content-Type': 'application/octet-stream'
  }
  //let accessionNumberAndAnon=await readAccessionNumberAndAnoncodeInJsonTmp();
    
  

  var upfname = path.basename(fname);
  //var upfname2=`${accessionNumberAndAnon["anoncode"]}/${accessionNumberAndAnon["accessionNumber"]}.tgz`;
 
 
  
  console.log('Uploading to '+bucket);
  try {
      minioClient.fPutObject(bucket, upfname, fname, metaData, (err, etag) => {
      if (err) {
        console.log("Error in uploading file!"+err);
        callback(false);
      } 
      console.log("Upload successfull!");
      fs.unlinkSync(fname);
      tmpDir.removeCallback();
      callback(true);
      //lambdaInvoke(minioClient,bucket,upfname);
    });
  } catch(err) {
    console.error(err);
    calback(false);
  }
};


module.exports.minioUpload = doMinioUpload;

