import prisma from "@shared/dbConfig/database.js";
import { Parser } from 'json2csv';
import { DateTime } from 'luxon';

export const RedemptionReport = async(req,res,next)=>{
    try {
        const report = await prisma.gift_redeem_request.groupBy({
            by: ['user_name', 'user_mobile', 'district', 'state'],
            _count: { id: true },
            _sum: { redeem_point: true, point_range_value: true },
            _max: { date_created: true },
        });

        const formatted = report.map(r => ({
            name: r.user_name,
            mobile: r.user_mobile,
            district: r.district,
            state: r.state,
            total_redeems: r._count.id,
            total_redeem_value: r._sum.redeem_point ?? r._sum.point_range_value ?? 0,
            last_redeem_date: r._max.date_created,
        }));

        res.status(200).json({data:formatted});
        } catch (error) {
        res.status(500).json({error:error.message});
        next(error)
    }
}
export const exportRedemptionReport = async(req,res,next)=>{
    try {
        const report = await prisma.gift_redeem_request.groupBy({
            by: ['user_name', 'user_mobile', 'district', 'state'],
            _count: { id: true },
            _sum: { redeem_point: true, point_range_value: true },
            _max: { date_created: true },
        });

        const formatted = report.map(r => ({
            name: r.user_name,
            mobile: r.user_mobile,
            district: r.district,
            state: r.state,
            total_redeems: r._count.id,
            total_redeem_value: r._sum.redeem_point ?? r._sum.point_range_value ?? 0,
            last_redeem_date: r._max.date_created,
        }));
       

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(formatted);

        res.header('Content-Type', 'text/csv');
        res.attachment('ReedemptionReport.csv');
        res.send(csv);

    }catch(error){
        res.status(500).json({error:error.message});
        next(error);
    }
    }
export const userScanReport = async(req,res,next)=>{
    try {
        const report = await prisma.offer_coupon_scan.groupBy({
            by: ['scanned_by_id', 'scanned_by_name', 'scanned_by_mobile', 'state', 'district'],
            _count: { scanned_by_id: true },
            _sum: { coupon_value: true ,total_point:true},
            _max: { scanned_date: true },
        });

        const formatted = report.map(r => ({
            name: r.scanned_by_name,
            mobile: r.scanned_by_mobile,
            state: r.state,
            district: r.district,
            total_scans: r._count.scanned_by_id,
            total_scan_value: r._sum.coupon_value ??r._sum.total_point ??0,
            last_scan_date: r._max.scanned_date
        }));
        res.status(200).json({data:formatted});
    } catch (error) {
        res.status(500).json({error:error.message});
        next(error)
    }
}

export const exportUserScanReport = async (req, res, next) => {
    try {
        const report = await prisma.offer_coupon_scan.groupBy({
            by: ['scanned_by_id', 'scanned_by_name', 'scanned_by_mobile', 'state', 'district'],
            _count: { scanned_by_id: true },
            _sum: { coupon_value: true, total_point: true },
            _max: { scanned_date: true },
        });

        const formatted = report.map(r => ({
            name: r.scanned_by_name,
            mobile: r.scanned_by_mobile,
            state: r.state,
            district: r.district,
            total_scans: r._count.scanned_by_id,
            total_scan_value: r._sum.coupon_value ?? r._sum.total_point ?? 0,
            last_scan_date: r._max.scanned_date
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(formatted);

        res.header('Content-Type', 'text/csv');
        res.attachment('UserScanReport.csv');
        res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error)
    }
}

export const sevenDaysNotScannedReport = async(req,res,next)=>{
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const inactiveUsers = await prisma.offer_coupon_scan.groupBy({
            by: ['scanned_by_id', 'scanned_by_name', 'scanned_by_mobile', 'state', 'district'],
            _count: { id: true },
            _sum: { coupon_value: true, total_point: true },
            _max: { scanned_date: true },
            having: {
                scanned_date: { _max: { lt: sevenDaysAgo } }
            }
        });

        const formatted = inactiveUsers.map(r => ({
            name: r.scanned_by_name,
            mobile: r.scanned_by_mobile,
            state: r.state,
            district: r.district,
            total_scans_before_7D: r._count.id,
            total_scan_value_before_7D: r._sum.coupon_value ?? r._sum.total_point ?? 0,
            last_scan_date_before_7D: r._max.scanned_date
        }));

        res.status(200).json({data:formatted});
    }catch(error){
        res.status(500).json({error:error.message});
        next(error);
    }
}

export const exportSevenDaysNotScannedReport = async (req, res, next) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const inactiveUsers = await prisma.offer_coupon_scan.groupBy({
            by: ['scanned_by_id', 'scanned_by_name', 'scanned_by_mobile', 'state', 'district'],
            _count: { id: true },
            _sum: { coupon_value: true, total_point: true },
            _max: { scanned_date: true },
            having: {
                scanned_date: { _max: { lt: sevenDaysAgo } }
            }
        });

        const formatted = inactiveUsers.map(r => ({
            name: r.scanned_by_name,
            mobile: r.scanned_by_mobile,
            state: r.state,
            district: r.district,
            total_scans_before_7D: r._count.id,
            total_scan_value_before_7D: r._sum.coupon_value ?? r._sum.total_point ?? 0,
            last_scan_date_before_7D: r._max.scanned_date
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(formatted);

        res.header('Content-Type', 'text/csv');
        res.attachment('SevenDaysNotScannedReport.csv');
        res.send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

export const couponHistoryReport = async(req,res,next)=>{
    try {
        const report = await prisma.offer_coupon_history.groupBy({
            by: ['created_by_id', 'created_by_name','remark','batch_name'],
            _count: { batch_name: true },
            _sum: { coupon_qty: true },
            _max: { date_created: true },
        });

        const formatted = report.map(r => ({
            user_name: r.created_by_name,
            user_id: r.created_by_id,
            remark: r.remark,
            total_batches: r._count.batch_name,
            total_coupons_generated: r._sum.coupon_qty,
            last_generation_date: r._max.date_created
        }));

        res.status(200).json({data:formatted});

    }catch(error){
        res.status(500).json({error:error.message});
        next(error);
    }
    }
export const exportCouponHistoryReport = async (req, res, next) => {
    try {
        const report = await prisma.offer_coupon_history.groupBy({
            by: ['created_by_id', 'created_by_name', 'remark', 'batch_name'],
            _count: { batch_name: true },
            _sum: { coupon_qty: true },
            _max: { date_created: true },
        });

        const formatted = report.map(r => ({
            user_name: r.created_by_name,
            user_id: r.created_by_id,
            remark: r.remark,
            total_batches: r._count.batch_name,
            total_coupons_generated: r._sum.coupon_qty,
            last_generation_date: r._max.date_created
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(formatted);

        res.header('Content-Type', 'text/csv');
        res.attachment('CouponHistoryReport.csv');  
        res.send(csv);

        
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

export const userBonusPoints = async(req,res,next)=>{
try {
    const result = await prisma.$queryRaw`
      SELECT 
        ic.id ,
        ic.name ,
        ic.mobile,
        ic.state,
        ic.district,
        ic.city,
        COALESCE(SUM(il.credit), 0) AS total_bonus_points
      FROM influencer_customer ic
      LEFT JOIN influencer_ledger il 
        ON ic.id = il.influencer_id 
        AND il.transaction_type_name = 'BONUS'
      GROUP BY ic.id, ic.name,ic.mobile, ic.state, ic.district, ic.city
      ORDER BY ic.id ASC;
    `;

    res.status(200).json({ data: result });
} catch (error) {
    res.status(500).json({error:error.message});
    next(error);
}
}
export const exportUserBonusPoints = async (req, res, next) => {
    try {
        const result = await prisma.$queryRaw`
      SELECT 
        ic.id ,
        ic.name ,
        ic.mobile,
        ic.state,
        ic.district,
        ic.city,
        COALESCE(SUM(il.credit), 0) AS total_bonus_points
      FROM influencer_customer ic
      LEFT JOIN influencer_ledger il 
        ON ic.id = il.influencer_id 
        AND il.transaction_type_name = 'BONUS'
      GROUP BY ic.id, ic.name,ic.mobile, ic.state, ic.district, ic.city
      ORDER BY ic.id ASC;
    `;

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(result);

        res.header('Content-Type', 'text/csv');
        res.attachment('UserBonusPoint.csv');
        res.send(csv);

} catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

export const influencerScanLogin = async(req,res,next)=>{
    try {
    const result = await prisma.influencer_customer.findMany({
        select: {
            id: true,
            name: true,
            mobile: true,
            state: true,
            district: true,
            city: true,
            last_scan_date: true,
            last_login_timestamp: true,
            current_wallet_balnc:true
        },

    })

    return res.status(200).json({data:result});
    }catch(error){
res.status(500).json({error:error.message});
next(error);
    }
}
export const exportInfluencerScanLogin = async (req, res, next) => {
    try {
        const result = await prisma.influencer_customer.findMany({
            select: {
                id: true,
                name: true,
                state: true,
                district: true,
                city: true,
                last_scan_date: true,
                last_login_timestamp: true,
                current_wallet_balnc: true
            },

        })

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(result);
        res.header('Content-Type', 'text/csv');
        res.attachment('InfluencerScanLogin.csv');
        res.send(csv);

    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}
export const stateKycStatus = async (req, res, next) => {
    try {
        const total = await prisma.influencer_customer.groupBy({
            by: ['state'],
            _count: { id: true },
        });

        const pending = await prisma.influencer_customer.groupBy({
            by: ['state'],
            where: { kyc_status: 'PENDING' },
            _count: { id: true },
        });

        const approved = await prisma.influencer_customer.groupBy({
            by: ['state'],
            where: { kyc_status: 'APPROVED' },
            _count: { id: true },
        });

        const verified = await prisma.influencer_customer.groupBy({
            by: ['state'],
            where: { status_of_profile: 'APPROVED' },
            _count: { id: true },
        });

        const merged = total.map(t => ({
            state: t.state,
            total_customers: t._count.id,
            kyc_status_pending:
                pending.find(p => p.state === t.state)?._count.id ?? 0,
            kyc_status_approved:
                approved.find(a => a.state === t.state)?._count.id ?? 0,
            document_verified:
                verified.find(v => v.state === t.state)?._count.id ?? 0,
        }));

        res.status(200).json({ data: merged });
    } catch (error) {
        console.error("Error in StateWiseInfluencerSummary:", error);
        res.status(500).json({ error: error.message });
    }
};
export const exportStateKycStatus = async (req, res, next) => {
    try {
        const total = await prisma.influencer_customer.groupBy({
            by: ['state'],
            _count: { id: true },
        });

        const pending = await prisma.influencer_customer.groupBy({
            by: ['state'],
            where: { kyc_status: 'PENDING' },
            _count: { id: true },
        });

        const approved = await prisma.influencer_customer.groupBy({
            by: ['state'],
            where: { kyc_status: 'APPROVED' },
            _count: { id: true },
        });

        const verified = await prisma.influencer_customer.groupBy({
            by: ['state'],
            where: { status_of_profile: 'APPROVED' },
            _count: { id: true },
        });

        const merged = total.map(t => ({
            state: t.state,
            total_customers: t._count.id,
            kyc_status_pending:
                pending.find(p => p.state === t.state)?._count.id ?? 0,
            kyc_status_approved:
                approved.find(a => a.state === t.state)?._count.id ?? 0,
            document_verified:
                verified.find(v => v.state === t.state)?._count.id ?? 0,
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(merged);

        res.header('Content-Type', 'text/csv');
        res.attachment('StateKycStatus.csv');
        res.send(csv);

    } catch (error) {
        console.error("Error in StateWiseInfluencerSummary:", error);
        res.status(500).json({ error: error.message });
    }
};

export const stateWiseLoginAgeing = async (req, res, next) => {
    try {
        const now = DateTime.now();
        const last7Days = now.minus({ days: 7 }).toJSDate();
        const last15Days = now.minus({ days: 15 }).toJSDate();
        const last30Days = now.minus({ days: 30 }).toJSDate();

        const total = await prisma.influencer_customer.groupBy({
            by: ["state"],
            _count: { id: true },
        });

        const within7 = await prisma.influencer_customer.groupBy({
            by: ["state"],
            where: {
                last_login_timestamp: {
                    gte: last7Days,
                },
            },
            _count: { id: true },
        });

        const within15 = await prisma.influencer_customer.groupBy({
            by: ["state"],
            where: {
                last_login_timestamp: {
                    gte: last15Days,
                },
            },
            _count: { id: true },
        });

        const within30 = await prisma.influencer_customer.groupBy({
            by: ["state"],
            where: {
                last_login_timestamp: {
                    gte: last30Days,
                },
            },
            _count: { id: true },
        });

        const merged = total.map(t => ({
            state: t.state,
            total_users: t._count.id,
            logged_within_7_days: within7.find(w => w.state === t.state)?._count.id ?? 0,
            logged_within_15_days: within15.find(w => w.state === t.state)?._count.id ?? 0,
            logged_within_30_days: within30.find(w => w.state === t.state)?._count.id ?? 0,
        }));

        res.status(200).json({ data: merged });
    } catch (error) {
        console.error("Error in stateWiseLoginAgeing:", error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};
export const exportStateWiseLoginAgeing = async (req, res, next) => {
    try {
        const now = DateTime.now();
        const last7Days = now.minus({ days: 7 }).toJSDate();
        const last15Days = now.minus({ days: 15 }).toJSDate();
        const last30Days = now.minus({ days: 30 }).toJSDate();

        const total = await prisma.influencer_customer.groupBy({
            by: ["state"],
            _count: { id: true },
        });

        const within7 = await prisma.influencer_customer.groupBy({
            by: ["state"],
            where: {
                last_login_timestamp: {
                    gte: last7Days,
                },
            },
            _count: { id: true },
        });

        const within15 = await prisma.influencer_customer.groupBy({
            by: ["state"],
            where: {
                last_login_timestamp: {
                    gte: last15Days,
                },
            },
            _count: { id: true },
        });

        const within30 = await prisma.influencer_customer.groupBy({
            by: ["state"],
            where: {
                last_login_timestamp: {
                    gte: last30Days,
                },
            },
            _count: { id: true },
        });

        const merged = total.map(t => ({
            state: t.state,
            total_users: t._count.id,
            logged_within_7_days: within7.find(w => w.state === t.state)?._count.id ?? 0,
            logged_within_15_days: within15.find(w => w.state === t.state)?._count.id ?? 0,
            logged_within_30_days: within30.find(w => w.state === t.state)?._count.id ?? 0,
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(merged);

        res.header('Content-Type', 'text/csv');
        res.attachment('StateWiseLoginAgeing.csv');
        res.send(csv);

    } catch (error) {
        console.error("Error in stateWiseLoginAgeing:", error);
        res.status(500).json({ error: error.message });
        next(error);
    }
};
export const categoryWiseScanReport = async (req, res, next) => {
    try {
        const report = await prisma.offer_coupon_scan.groupBy({
            by: ['point_category_id', 'point_category_name'],
            _count: { point_category_id: true },
            _sum: {  coupon_value: true },
            });

            const formatted = report.map(r => ({
                point_category_id: r.point_category_id,
                point_category_name: r.point_category_name,
                total_scans: r._count.point_category_id,
                total_scan_value: r._sum.coupon_value ?? 0,
            }));

            res.status(200).json({data:formatted});

    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}
export const exportCategoryWiseScanReport = async (req, res, next) => {
    try {
        const report = await prisma.offer_coupon_scan.groupBy({
            by: ['point_category_id', 'point_category_name'],
            _count: { point_category_id: true },
            _sum: { coupon_value: true },
        });

        const formatted = report.map(r => ({
            point_category_id: r.point_category_id,
            point_category_name: r.point_category_name,
            total_scans: r._count.point_category_id,
            total_scan_value: r._sum.coupon_value ?? 0,
        }));

      const josn2csvParser = new Parser();
      const csv = josn2csvParser.parse(formatted);

      res.header('Content-Type', 'text/csv');
      res.attachment('CategoryWiseScanReport.csv');
      res.send(csv);
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}

export const monthlyScanAgeing = async (req, res, next) => {
    try {
        const now = DateTime.now();
        const start = now.minus({ months: 11 }).startOf("month");

        const [influencers, scans] = await Promise.all([
            prisma.influencer_customer.groupBy({
                by: ["state"],
                _count: { id: true },
            }),
            prisma.offer_coupon_scan.findMany({
                where: { date_created: { gte: start.toJSDate() } },
                select: { state: true, date_created: true, coupon_value: true },
            }),
        ]);

        const grouped = {};
        scans.forEach(({ state = "Unknown", date_created, coupon_value = 0 }) => {
            const month = DateTime.fromJSDate(date_created).toFormat("MMM yyyy");
            grouped[state] ??= {};
            grouped[state][month] ??= { total_scans: 0, total_scan_value: 0 };
            grouped[state][month].total_scans++;
            grouped[state][month].total_scan_value += coupon_value;
        });

        const months = Array.from({ length: 12 }, (_, i) =>
            now.minus({ months: 11 - i }).toFormat("MMM yyyy")
        );

        const result = [
            ...new Set([
                ...influencers.map((i) => i.state || "Unknown"),
                ...Object.keys(grouped),
            ]),
        ].map((state) => ({
            state,
            total_influencers:
                influencers.find((i) => i.state === state)?._count.id || 0,
            monthly_data: months.map((m) => ({
                month: m,
                total_scans: grouped[state]?.[m]?.total_scans || 0,
                total_scan_value: grouped[state]?.[m]?.total_scan_value || 0,
            })),
        }));

        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
};

export const exportMonthlyScanAgeing = async (req, res, next) => {
    try {
        const now = DateTime.now();
        const start = now.minus({ months: 11 }).startOf("month");

        const [influencers, scans] = await Promise.all([
            prisma.influencer_customer.groupBy({
                by: ["state"],
                _count: { id: true },
            }),
            prisma.offer_coupon_scan.findMany({
                where: { date_created: { gte: start.toJSDate() } },
                select: { state: true, date_created: true, coupon_value: true },
            }),
        ]);

        const grouped = {};
        scans.forEach(({ state = "Unknown", date_created, coupon_value = 0 }) => {
            const month = DateTime.fromJSDate(date_created).toFormat("MMM yyyy");
            grouped[state] ??= {};
            grouped[state][month] ??= { total_scans: 0, total_scan_value: 0 };
            grouped[state][month].total_scans++;
            grouped[state][month].total_scan_value += coupon_value;
        });

        const months = Array.from({ length: 12 }, (_, i) =>
            now.minus({ months: 11 - i }).toFormat("MMM yyyy")
        );

        const result = [
            ...new Set([
                ...influencers.map((i) => i.state || "Unknown"),
                ...Object.keys(grouped),
            ]),
        ].map((state) => ({
            state,
            total_influencers:
                influencers.find((i) => i.state === state)?._count.id || 0,
            monthly_data: months.map((m) => ({
                month: m,
                total_scans: grouped[state]?.[m]?.total_scans || 0,
                total_scan_value: grouped[state]?.[m]?.total_scan_value || 0,
            })),
        }));

     const json2csvParser = new Parser();
     const csv = json2csvParser.parse(result);

     res.header('Content-Type', 'text/csv');
     res.attachment('MonthlyScanAgeing.csv');
     res.send(csv);   
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
};

export const scanPointReportProductWise = async (req, res, next) => {  
try {
    const report = await prisma.offer_coupon_scan.groupBy({
        by:["state","product_detail","coupon_value"],
        _count: { id: true },
        _sum:{coupon_value:true},
    })

    const formatted = report.map(r=>({
        state:r.state,
        product_detail:r.product_detail,
        coupon_value:r.coupon_value,
        total_scan:r._count.id,
        total_scan_value:r._sum.coupon_value,
    }))
    
    return res.status(200).json({data:formatted});
} catch (error) {
    res.status(500).json({error:error.message});
    next(error);
}
}

export const exportScanPointReportProductWise = async (req, res, next) => {
    try {
        const report = await prisma.offer_coupon_scan.groupBy({
            by: ["state", "product_detail", "coupon_value"],
            _count: { id: true },
            _sum: { coupon_value: true },
        })

        const formatted = report.map(r => ({
            state: r.state,
            product_detail: r.product_detail,
            coupon_value: r.coupon_value,
            total_scan: r._count.id,
            total_scan_value: r._sum.coupon_value,
        }))

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(formatted);
    
        res.header('Content-Type', 'text/csv');
        res.attachment('ScanPointReport.csv');
        res.send(csv);
    
    } catch (error) {
        res.status(500).json({ error: error.message });
        next(error);
    }
}
