import prisma from '@shared/dbConfig/database.js'

export const resetPassword = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        
        const user = await prisma.sfa_user.findFirst({
            where: { username },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

       

       
        await prisma.sfa_user.update({
            where: {
                id: user.id, 
            },
            data: {
                password,
            },
        });

        return res.status(200).json({ message: 'Successfully reset password' });
    } catch (error) {
        next(error);
    }
};
