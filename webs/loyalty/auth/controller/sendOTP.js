import {
    generateMobileOtp,
    storeOtp
} from "@shared/services/otp.service.js";
import { sendOtpSms } from "@shared/services/sms.service.js";

    export const sendOTP = async (req, res, next) => {
        const { contact_01 } = req.body;

        if (!contact_01) {
            return res.status(400).json({
                success: false,
                message: "phone number are required.",
            });
        }

        try {
            const otp = generateMobileOtp();
            await storeOtp(contact_01, otp, "mobile");

            try {
                if (config.sms.enabled === true) {
                    await sendOtpSms(contact_01, otp);
                } else {
                    console.log(`SMS service disabled. Fallback OTP for ${contact_01}: ${otp}`);
                }
            } catch (smsError) {
                console.error(`SMS sending failed for ${contact_01}:`, smsError.message);
                console.log(`Fallback OTP for ${contact_01}: ${otp}`);
            }

                
            return res.status(200).json({
                success: true,
                message: "OTP sent successfully",
            });
        } catch (error) {
            next(error);
            console.error("Error in requestOtp:", error);

        }
    };