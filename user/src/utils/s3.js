const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const AppError = require("./AppError");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadToS3FromFile = async (file) => {
  if (!file) throw new Error("File is required");

  try {
    const Bucket = process.env.AWS_BUCKET_NAME;
    const Key = `uploads/${Date.now()}-${(file.originalname || "").replace(
      /\s+/g,
      "-"
    )}`;
    const Body = file.buffer;
    const ContentType = file.mimetype;

    const command = new PutObjectCommand({
      Bucket,
      Key,
      Body,
      ContentType,
    });

    await s3.send(command);

    return `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
  } catch (error) {
    throw AppError.internal("Failed to upload to S3 the file");
  }
};

module.exports = { uploadToS3FromFile };
