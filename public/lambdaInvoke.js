const AWS = require('aws-sdk');

function lambdaInvoke(minioClient,bucket,path){
    
    AWS.config.update({
        region:  minioClient.region, 
        credentials: new AWS.Credentials({
            accessKeyId: minioClient.accessKey, 
            secretAccessKey: minioClient.secretKey
        })
    });

    
    const lambda = new AWS.Lambda();

    
    const params = {
        FunctionName: 'lambdaImageDB', 
        Payload: JSON.stringify({
            "path": path,
            "bucket":bucket
        }) 
    };

    // Invocare la Lambda
    lambda.invoke(params, function(err, data) {
    if (err) {
        console.error(err,'lambdaInvoke error'); 
    } else {
        console.log(data.Payload,'lambdaInvoke success'); 
    }
    });
}
module.exports.lambdaInvoke = lambdaInvoke;