import jwt from 'jsonwebtoken';
import redisClient from '@shared/dbConfig/redis.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];

        const accessToken = authHeader?.split(' ')[1];
        const refreshToken = req.cookies?.refreshToken;
       
        if (!accessToken && !refreshToken) {
            return res.status(401).json({ message: 'Access denied, no token provided' });
        }

        if (accessToken) {
            jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decodedUser) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid access token' });
                }

                const storedToken = await redisClient.get(`user:${decodedUser.id}:accessToken`);
                if (storedToken !== accessToken) {
                    return res.status(403).json({ message: 'Token expired or invalid' });
                }

                req.user = decodedUser; 
                return next();
            });
            return;
        }

        if (refreshToken) {
            jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decodedUser) => {
                if (err) return res.status(403).json({ message: 'Invalid refresh token' });

                const newAccessToken = jwt.sign(
                    { id: decodedUser.id, name: decodedUser.name }, 
                    process.env.JWT_SECRET,
                    {  algorithm: 'HS256' }
                );

                await redisClient.setEx(`user:${decodedUser.id}:accessToken`, 60 * 60 * 24, newAccessToken);

                res.setHeader('x-access-token', newAccessToken);
                req.user = decodedUser;
                return next();
            });
            return;
        }

        return res.status(401).json({ message: 'No valid token found' });

    } catch (error) {
        next(error);
    }
};
