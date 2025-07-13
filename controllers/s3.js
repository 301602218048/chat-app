const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
});

const uploadtoS3 = async (file, filename) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filename,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
    ContentDisposition: "inline",
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

module.exports = uploadtoS3;
