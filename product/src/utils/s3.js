const AWS = require("aws-sdk");

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();

// Upload files to S3 and return URLs
const uploadAndGetUrls = async (files, folder = "products") => {
  if (!files || files.length === 0) {
    return [];
  }

  try {
    const uploadPromises = files.map(async (file) => {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}-${
          file.originalname
        }`,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
      };

      const result = await s3.upload(params).promise();
      return result.Location;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    throw new Error(`S3 upload failed: ${error.message}`);
  }
};

module.exports = {
  uploadAndGetUrls,
};
