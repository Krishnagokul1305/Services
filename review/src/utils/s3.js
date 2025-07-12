const AWS = require("aws-sdk");

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadFileToS3 = async (file, folder = "reviews") => {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

const uploadMultipleFilesToS3 = async (files, folder = "reviews") => {
  if (!files || files.length === 0) return [];

  try {
    const uploadPromises = files.map((file) => uploadFileToS3(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    throw new Error(`Multiple file upload failed: ${error.message}`);
  }
};

const deleteFileFromS3 = async (url) => {
  try {
    const key = url.split(".com/")[1];
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    throw new Error(`S3 delete failed: ${error.message}`);
  }
};

module.exports = {
  uploadFileToS3,
  uploadMultipleFilesToS3,
  deleteFileFromS3,
};
