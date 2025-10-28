import express from 'express';
import { availableGift, countInfluencerStateWise, getCouponDataforCharts, getInfluencerDataforCharts, last6MonthScanVsGenerated, pendingRedeemReqCount } from '../controllers/dashboardControllers.js';
const dashboardRoutes = express.Router();

// Route to get dashboard data
dashboardRoutes.get('/pending_redeem_request_count', pendingRedeemReqCount)
dashboardRoutes.get('/available_gift', availableGift);
dashboardRoutes.get('/influencer_state_wise', countInfluencerStateWise);
dashboardRoutes.get('/influencer_data', getInfluencerDataforCharts);
dashboardRoutes.get('/coupon_data', getCouponDataforCharts);
dashboardRoutes.get('/last_six_month_scan_generated', last6MonthScanVsGenerated);

export default dashboardRoutes;