import { verifyOtp } from "@shared/services/otp.service.js";
import prisma from "@shared/dbConfig/database.js";

export const verifyOTP = async (req, res, next) => {
    const { contact_01, otp } = req.body;

    try {
        const user = await prisma.sfa_user.findUnique({ where: { contact_01 } });

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        const isValid = await verifyOtp(contact_01, otp);
        if (!isValid) {
            return res.status(400).json({ status: false, message: "Invalid or expired OTP" });
        }

        return res.status(200).json({ status: true, message: "OTP verified successfully" });
    } catch (error) {
        next(error);
    }
};
