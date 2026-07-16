import "dotenv/config";
export const buildFileUrl = (objectKey) =>
    `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${objectKey}`;