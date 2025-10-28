import redisClient from "@shared/dbConfig/redis.js";

export const logoutUser = async (req, res) => {
    try {
        const userId = req.user.id; // from authenticateToken middleware

        if (!userId) {
            return res.status(400).json({ message: "User not found in request" });
        }

        // Delete access & refresh tokens from Redis
        await redisClient.del(`user:${userId}:accessToken`);
        await redisClient.del(`user:${userId}:refreshToken`);

        // Clear refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
        });

        return res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Failed to logout user" });
    }
};
