import express from 'express';
import corsPrefetch from 'cors-prefetch-middleware';
import imagesUpload from 'images-upload-middleware';

const app = express();

app.use('/static', express.static('./static'));

app.use(corsPrefetch);

app.post('/multiple', imagesUpload(
    './static/multipleFiles',
    'http://localhost:9090/static/multipleFiles',
    true
));


app.post('/uploadToS3', function(req, res){

    var s3 = require('s3');
    // create s3 client
    var client = s3.createClient({
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
            accessKeyId: "your s3 key",
            secretAccessKey: "your s3 secret",
            region: "your region",
            // endpoint: 's3.yourdomain.com',
            // sslEnabled: false
            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        },
    });

    var params = {
        localFile: "some/local/file",

        s3Params: {
            Bucket: "s3 bucket name",
            Key: "some/remote/file",
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        },
    };

    var uploader = client.uploadFile(params);
    uploader.on('error', function(err) {
        console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function() {
        console.log("progress", uploader.progressMd5Amount,
            uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function(){
        console.log("done uploading");
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