import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import crypto from "crypto";
import path from "path";
import { buildFileUrl } from "../utils/buildFileUrl.js";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:
            process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey:
            process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const upload = async (
    file,
    folder = "attachments"
) => {

    const extension = path.extname(
        file.originalname
    );

    const fileName =
        `${crypto.randomUUID()}${extension}`;

    const objectKey =
        `${folder}/${fileName}`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket:
                process.env.AWS_BUCKET_NAME,
            Key: objectKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );

    return {
        fileName,
        objectKey,
        url: buildFileUrl(objectKey)
    };
};

const remove = async (
    objectKey
) => {

    await s3Client.send(
        new DeleteObjectCommand({
            Bucket:
                process.env.AWS_BUCKET_NAME,
            Key: objectKey,
        })
    );

    return true;
};

export const s3Service = {
    upload,
    delete: remove,
};