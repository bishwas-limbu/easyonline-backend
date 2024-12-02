import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import config from '../config/config.js';


// Initialize the S3 client
export const s3Client = new S3Client({
    credentials: {
        accessKeyId: config.ACCESS_KEY,
        secretAccessKey: config.SECRET_ACCESS_KEY,
    },
    region: config.BUCKET_REGION,
});

