import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Express } from "express";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3FromFile = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!file) throw new Error("File is required");

  const Bucket = process.env.AWS_BUCKET_NAME!;
  const Key = `uploads/${Date.now()}-${file.originalname}`;
  const Body = file.buffer;
  const ContentType = file.mimetype;

  const command = new PutObjectCommand({
    Bucket,
    Key,
    Body,
    ContentType,
    ACL: "public-read",
  });

  await s3.send(command);

  return `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};
