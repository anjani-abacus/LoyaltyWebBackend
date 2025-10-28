import prisma from "@shared/dbConfig/database.js";
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";
export const getAllredeemRequest=async(req,res,next)=>{
    const { page = 1, limit = 20 ,filters={}} = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const fieldTypes = {
            req_id: "string",
            status: "boolean",
            date_created: "date",
            gift_type:"enum",
            action_status:"enum",
            user_name:"string",
            user_mobile:"string",
            bank_name:"string",
            account_number:"string",
            ifsc_code:"string",
            upi_id:"string",
            state:"string",
            district:"string",
        };

    const where = buildPrismaFilters(filters, fieldTypes);
    const response=  await  prisma.gift_redeem_request.findMany({
        where,
        skip,
        take,
        orderBy:{date_created:"desc"}
      })
        const [statusCountsRaw, total] = await Promise.all([
            prisma.gift_redeem_request.groupBy({
                by: ["action_status"],
                _count: { _all: true },
                where: {  del: false },
            }),
            prisma.gift_redeem_request.count({
                where: {  del: false },
}),
        ]);

        const statusCounts = statusCountsRaw.reduce((acc, item) => {
            acc[item.action_status] = item._count._all;
            return acc;
        }, {});

          
       
     res.status(201).json({status:true,message:"Successfully Fetch",
         totalCount: total,
         TabList: [
             { key: "Pending", count: statusCounts.PENDING || 0 },
             { key: "Approved", count: statusCounts.APPROVED || 0 },
             { key: "Reject", count: statusCounts.REJECT || 0 },
         ],
        data:response}) 
    } catch (error) {
        next(error)
    }
}
export const getRedeemRequestById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const response = await prisma.gift_redeem_request.findMany({
            where: { user_id: Number(id) },
            orderBy: { date_created: "desc" }
        });
        return res.status(200).json({ status: true, message: "Successfully Fetch", data: response });

    } catch (error) {
        next(error);
    }
}

export const updateRedeemRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { action_status } = req.body;

        await prisma.gift_redeem_request.update({
            where: { id: Number(id) },
            data: { action_status }
        });
        res.status(200).json({ message: 'Redeem Request Status updated successfully' });
    } catch (error) {
        next(error);
    }
}
