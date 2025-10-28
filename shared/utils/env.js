
const requiredVars = [
    "DATABASE_URL",
    "BASE_URL",
    "REDIS_URL",
    "JWT_SECRET",
    "SMS_GATEWAY_URL",
    "SMS_GATEWAY_USERNAME",
    "SMS_GATEWAY_PASSWORD",
    "SMS_GATEWAY_SENDER_ID",
    "S3_ACCESS_KEY",
    "S3_SECRET_KEY",
    "S3_BUCKET_NAME",
    "S3_ENDPOINT"
];

const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    console.error(
        `❌ Missing required environment variables:\n${missingVars.join("\n")}`
    );
    process.exit(1); // Stop the app
}

export const config = {
    app: {
        port: process.env.PORT,
        baseUrl: process.env.BASE_URL,
        nodeEnv: process.env.NODE_ENV,
    },
    db: {
        url: process.env.DATABASE_URL,
    },
    redis: {
        url: process.env.REDIS_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },
    sms: {
        enabled: process.env.SMS_GATEWAY,
        url: process.env.SMS_GATEWAY_URL,
        username: process.env.SMS_GATEWAY_USERNAME,
        password: process.env.SMS_GATEWAY_PASSWORD,
        senderId: process.env.SMS_GATEWAY_SENDER_ID,
    },
    s3: {
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY,
        bucketName: process.env.S3_BUCKET_NAME,
        endpoint: process.env.S3_ENDPOINT,
        publicUrl: process.env.S3_PUBLIC_URL,
    },
};
