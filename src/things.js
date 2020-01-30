var express = require('express');
var multer = require('multer');
var router = express.Router();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname+'/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // modified here  or user file.mimetype
    }
})
  
var upload = multer({ storage: storage })


router.get('/script', function (req, res) {
    var SearchUbi = (isDev ? path.join('resources', 'hello.py') : path.join('resources', 'hello.py'));
    let pythonProcess = exec.spawn("python",[__dirname+"/"+SearchUbi])
    pythonProcess.stdout.on('data', (data) => {
        console.log("Python returns:",data.toString())
        res.send(data.toString());
    });
    pythonProcess.stderr.on('data', (data) => {
        //Errors
    });
});

router.post('/send-image', upload.single('image'), function(req, res){
    if (!req.file) {
        console.log("No file received");
        return res.send({
            success: false
        });
    } else {
        console.log('file received');
        return res.send({
            success: true
        })
    }
})

module.exports = router