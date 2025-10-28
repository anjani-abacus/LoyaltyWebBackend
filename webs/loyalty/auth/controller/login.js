import prisma from '@shared/dbConfig/database.js' 
import jwt from 'jsonwebtoken';
import redisClient from '@shared/dbConfig/redis.js';

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await prisma.sfa_user.findFirst({
            where: { username ,password,del:false},
        });

        if (!user) {
            return res.status(404).json({ message: 'Invalid username or password' });
        }
        
        const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn:'24h',
            algorithm: 'HS256'
        });
        const refreshToken = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: '7D',
            algorithm: 'HS256'
        });
        await redisClient.setEx(`user:${user.id}:accessToken`, 60 * 60 * 24, accessToken);
        await redisClient.setEx(`user:${user.id}:refreshToken`, 60 * 60 * 24 * 7, refreshToken);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, 
        })
        return res.status(200).json({ message: 'Successfully logged in!', accessToken ,refreshToken});
    } catch (error) {
        next(error);
    }
};
