import prisma from "@shared/dbConfig/database.js";

export const createScannedCoupon = async (req, res, next) => {
    const {
        transaction_id,
        scanned_by,
        scanned_by_name,
        scanned_by_mobile,
        influencer_type,
        coupon_code,
        point_category_name,
        point_category_id,
        product_detail,
        coupon_value,
        coupon_id,
        state,
        region,
        category,
        sub_category,
        batch_name 
    } = req.body;
    try {
        const scannedCoupon = await prisma.offer_coupon_scan.create({
            data: {
                transaction_id,
                scanned_by:Number(scanned_by),
                scanned_by_name,
                scanned_by_mobile,
                influencer_type,
                coupon_code,
                point_category_name,
                point_category_id:Number(point_category_id),
                product_detail,
                coupon_value,
                batch_name,
                coupon_id:Number(coupon_id),
                state,
                region,
                category,
                sub_category
            }        },
        )
      await prisma.offer_coupon.update({
            where: { id: Number(coupon_id) },
            data: {
                is_Scanned: true
            }
        })

        res.status(200).json({
            status: true,
            message: "Scanned coupon created successfully",
            scannedCoupon
        })
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}

export const getAllScannedCoupon = async (req, res, next) => {
    const { page = 1, limit = 50, filters = {} } = req.body;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    try {
        const scannedCouponCount = await prisma.offer_coupon_scan.count();
        const scannedCoupon = await prisma.offer_coupon_scan.findMany({
            where: { ...filters, del: false},
            skip,
            take,
        })
        return res.status(200).json({
            status: true,
            message: "Scanned coupon fetched successfully",
            count: scannedCouponCount,
            data:scannedCoupon
        })
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}   
