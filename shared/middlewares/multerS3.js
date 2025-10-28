import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { config } from '../utils/env.js';

const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: config.s3.endpoint,
    forcePathStyle: true,
    credentials: {
        accessKeyId: config.s3.accessKey,
        secretAccessKey: config.s3.secretKey,
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: config.s3.bucketName,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            const filename = file.fieldname + '-' + Date.now() + '-' + file.originalname;
            cb(null, filename);
        },
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname,
                originalName: file.originalname,
                uploadedAt: new Date().toISOString(),
            });
        },
    }),
    fileFilter: function (req, file, cb) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/jpg',
            'application/pdf',
            'text/csv'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image or PDF files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024
    },
});

export default upload;




