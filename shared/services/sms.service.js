import axios from 'axios';
import logger from '../utils/logger.js';

export async function getAppHash() {
    // return 'a5pA8NJYEkK'; //production
    return 'ZN8MBeVNRvP'; //development
}

const SMS_GATEWAY_URL = process.env.SMS_GATEWAY_URL;

export async function sendOtpSms(mobileNumber, otp) {
    if (!SMS_GATEWAY_URL || SMS_GATEWAY_URL === 'your_sms_gateway_url') {
        throw new Error('SMS gateway URL not configured');
    }

    if (!process.env.SMS_GATEWAY_USERNAME || process.env.SMS_GATEWAY_USERNAME === 'your_sms_username') {
        throw new Error('SMS gateway credentials not configured');
    }

    const hash = await getAppHash();
    const message = `<#> Your Verification Code is: ${otp}. Do not share it with anyone. Team ABACUS DESK IT SOLUTIONS PVT. LTD.\n${hash}`;

    logger.info(`Sending SMS to ${mobileNumber}: ${message}`);

    const params = {
        username: process.env.SMS_GATEWAY_USERNAME,
        pass: process.env.SMS_GATEWAY_PASSWORD,
        senderid: process.env.SMS_GATEWAY_SENDER_ID,
        dest_mobileno: mobileNumber,
        msgtype: 'TXT',
        message: message,
        response: 'Y',
    };

    try {
        const response = await axios.get(SMS_GATEWAY_URL, { params });
        return response.data;
    } catch (error) {
        logger.error(`Error sending SMS to ${mobileNumber}: ${error.message}`);
        if (error.response?.data) {
            logger.error(`Gateway response: ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(
            config.app.nodeEnv === 'development'
                ? `Failed to send OTP SMS: ${error.message}`
                : 'Failed to send OTP SMS'
        );
    }
}
