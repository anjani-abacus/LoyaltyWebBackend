import { nanoid } from "nanoid";
import prisma from "@shared/dbConfig/database.js";
import buildPrismaFilters from "@shared/common/buildPrismaFilters.js";

export const generateCoupons = async (req, res, next) => {
    const {
        point_category_name,
        point_category_id,
        remark,
        product_mrp,
        product_qty,
        product_detail,
        product_id,
        coupon_qty,
        paper_size,
        batch_name,
        template_id
    } = req.body;
    const { id, name } = req.user;
    try {
    
        const couponHistory = await prisma.offer_coupon_history.create({
            data: {
                point_category_id: Number(point_category_id),
                point_category_name,
                product_id: Number(product_id),
                product_detail,
                coupon_qty: Number(coupon_qty),
                remark,
                paper_size,
                batch_name,
                template_id: Number(template_id),
                created_by_id:id,
                created_by_name:name
            }    
            },
        );

        
        const generateCodes = async (qty) => {
            const codes = new Set();
            while (codes.size < qty) {
                const newCode = nanoid(10).toLowerCase();
                codes.add(newCode);    
            }
            return Array.from(codes);
        };

        const generatedCodes = await generateCodes(Number(coupon_qty));

        
        const couponData = generatedCodes.map((code) => ({
            offer_coupon_history_id: couponHistory.id,
            coupon_code: code,
            point_category_name,
            point_category_id: Number(point_category_id),
            product_id: Number(product_id),
            product_detail,
            product_qty: Number(product_qty),
            product_mrp: Number(product_mrp),
            remark,
            batch_name,
            created_by_id:id,             
            created_by_name :name
        }));

        const couponGenerated = await prisma.offer_coupon.createMany({
            data: couponData,
            skipDuplicates: true
        },     
    );

        
        res.status(201).json({
            status: true,
            message: `Successfully generated ${couponGenerated.count} coupons`,
            couponHistory,
            coupons:couponData
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getAllCouponHistory = async (req, res, next) => {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const fieldTypes = {
            category: "string",
            status: "boolean",
            date_created: "date",
            point_category_name: "string",
            product_id: "number",
            product_detail: "string",
            product_code: "string"
        };

        const where = buildPrismaFilters(filters, fieldTypes);
        const couponHistoryCount = await prisma.offer_coupon_history.count();
        const totalActive = await prisma.offer_coupon_history.count({ where: { del: false } });
        const totalInactive = couponHistoryCount - totalActive;
        const couponHistory = await prisma.offer_coupon_history.findMany({
            where,
            include:{
                coupons:true
            },
            skip,
            take,
            orderBy:{
                date_created:'desc'
            }
        });
        
        res.status(200).json({
            status: true,
            message: "Coupon history fetched successfully",
            count: couponHistoryCount.length,
            totalActive,
            totalInactive,
            data:couponHistory
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getAllOfferCouponHistoryList = async (req, res, next) => {
    const { page = 1, limit = 20, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const couponHistoryCount = await prisma.offer_coupon.count();
        const totalActive = await prisma.offer_coupon.count({ where: { is_Scanned: true, del: false } });
        const totalInactive = couponHistoryCount - totalActive;
        const couponHistory = await prisma.offer_coupon.findMany({
            where: { ...filters, del: false },
            skip,
            take,
            orderBy:{
                id:'desc'
            }
        });
      
        res.status(200).json({
            status: true,
            message: "Coupon history list fetched successfully",
            count: couponHistoryCount,
            totalActive,
            totalInactive,
            data:couponHistory
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}   

export const softDeleteOfferCouponHistory = async (req, res, next) => {
    const { id } = req.params;
    try {
      await Promise.all([ prisma.offer_coupon_history.update({
            where: { id: Number(id) },
            data: { del: true }
        }),
         prisma.offer_coupon.updateMany({
            where: { offer_coupon_history_id: Number(id) },
            data: { del: true }
        }),
    ])
        res.status(200).json({
            status: true,
            message: "Successfully deleted offer coupon history And offer coupon"
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}   

// export const reOpenOfferCoupon = async (req, res, next) => {
//     const { id } = req.params;
//     try {
        
//     }
//     catch (error) {
//         res.status(500).json({message:"Something went wrong"})
//         next(error);
//     }
// }