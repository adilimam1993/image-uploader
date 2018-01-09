import express from 'express';
import corsPrefetch from 'cors-prefetch-middleware';
import imagesUpload from 'images-upload-middleware';
import bodyParser from 'body-parser';

const app = express();

app.use('/static', express.static('./static'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(corsPrefetch);

app.post('/multiple', imagesUpload(
    './static/multipleFiles',
    'http://localhost:9090/static/multipleFiles'
));


app.post('/uploadToS3', function(req, res) {

    var path = require('path');
    var image = path.basename(req.body.image);
    var AWS = require('aws-sdk');

    AWS.config.update({region: 'us-east-1', accessKeyId:'AKIAIZHU5EC7F2FIBNVA', secretAccessKey:'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'});

        var s3 = new AWS.S3({apiVersion: '2006-03-01'});
        var uploadParams = {Bucket: 'lost-and-found-bucket', Key: '', Body: ''};
        var file = "./static/multipleFiles/"+image;

        var fs = require('fs');
        var fileStream = fs.createReadStream(file);
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        uploadParams.Key = path.basename(file);

        s3.upload (uploadParams, function (err, data) {
            if (err) {
                console.log("Error", err);
            } if (data) {
                console.log("Upload Success", data.Location);
            }
        });
    }
);


app.post('/notmultiple', imagesUpload(
    './static/files',
    'http://localhost:9090/static/files'
));

app.listen(9090, () => {
    console.log('Listen: 9090');
});


