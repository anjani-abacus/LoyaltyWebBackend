import prisma from "@shared/dbConfig/database.js";

export const buildLeaderboard = async (filter = {}) => {
    const entries = await prisma.influencer_customer.findMany({
        where: {
            current_wallet_balnc: { not: null },
            ...filter,
        },
        orderBy: { current_wallet_balnc: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            current_wallet_balnc: true,
            profile_img: true,
            state: true,
            district: true,
        },
        take: 30
    });

    if (!entries.length) {
        let message = "No entries found to build a leaderboard.";
        if (filter.state) {
            message = `No records found for the specified state.`;
        } else if (filter.district) {
            message = `No records found for the specified district.`;
        }

        return {
            message: message,
            entries: []
        };
    }

    return {
        entries
    };
};

export const getLeaderBoardByState = async (req, res, next) => {
    try {
        const { state } = req.body;
       
        const leaderboard = await buildLeaderboard({ state });
        res.json({ success: true, leaderboard });
    } catch (error) {
        next(error);
    }
};

export const getLeaderBoardByDistrict = async (req, res, next) => {
    try {
        const { district } = req.body;
      
        const leaderboard = await buildLeaderboard({ district });
        res.json({ success: true, leaderboard });
    } catch (error) {
        next(error);
    }
};