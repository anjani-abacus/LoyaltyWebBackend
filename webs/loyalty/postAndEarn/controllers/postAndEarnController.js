import prisma from "@shared/dbConfig/database.js";

export const getPostAndEarn=async(req,res,next)=>{
    try {
        const { page = 1, limit = 50 } = req.body ;

        const skip = (page - 1) * limit;
        const take = limit;
        
        const data = await prisma.post_and_Earn.findMany({
            include:{
                post_and_Earn_instafeedlikes:true
            },
         orderBy:{
            date_created:'desc'
         },
         skip,
         take
        });
       return res.status(200).json({ success: true, data:data,count:data.length })
    } catch (error) {
        console.error('Error fetching influencer data:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
        next(error);
    }
}