let rimraf = require("rimraf");
const fs = require('fs')

exports.removeFolder = (folderPath,callback) => {
    rimraf(folderPath, function () { 
        console.log(callback(true)); 
    });
};

exports.checkCertificateInHost = (certificatePath)=>{
    try {
        if (fs.existsSync(certificatePath)) {
          return true;
        }else{
            return false;
        }
    } catch(err) {
        console.error(err)
        return false;
    }
}
