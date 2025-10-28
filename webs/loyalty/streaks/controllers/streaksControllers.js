import prisma from "@shared/dbConfig/database.js";

export const getStreak = async (req, res, next) => {
    try {
        const { page = 1, limit = 50 } = req.body;

        const skip = (page - 1) * limit;
        const take = limit;

        const data = await prisma.user_streaks.findMany({
            include: {
                influencer_customer: {
                    select: {
                        name: true,
                        influencer_type_name:true
                },
            }},
            orderBy: {
                date_created: 'desc',
            },
            skip,
            take,
        });

        return res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    } catch (error) {
        console.error('Error fetching streak data:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
};
