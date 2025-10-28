import express from 'express';
import { categoryWiseScanReport, couponHistoryReport, exportCategoryWiseScanReport, exportCouponHistoryReport, exportInfluencerScanLogin, exportMonthlyScanAgeing, exportRedemptionReport,  exportScanPointReportProductWise, exportSevenDaysNotScannedReport, exportStateKycStatus, exportStateWiseLoginAgeing, exportUserBonusPoints, exportUserScanReport, influencerScanLogin, monthlyScanAgeing, RedemptionReport,  scanPointReportProductWise, sevenDaysNotScannedReport, stateKycStatus, stateWiseLoginAgeing, userBonusPoints, userScanReport } from '../controllers/reportController.js';
const reportRouter = express.Router();

reportRouter.get('/redemption_report',RedemptionReport);
reportRouter.post('/export_redemption_report',exportRedemptionReport);


reportRouter.get('/user_scan_report',userScanReport);
reportRouter.post('/export_user_scan_report',exportUserScanReport);


reportRouter.get('/seven_days_not_scanned_report',sevenDaysNotScannedReport);
reportRouter.post('/export_seven_days_not_scanned_report',exportSevenDaysNotScannedReport);


reportRouter.get('/coupon_history_report',couponHistoryReport);
reportRouter.post('/export_coupon_history_report',exportCouponHistoryReport);

reportRouter.get('/user_bonus_points',userBonusPoints);
reportRouter.post('/export_user_bonus_points',exportUserBonusPoints);

reportRouter.get('/influencer_scan_login',influencerScanLogin);
reportRouter.post('/export_influencer_scan_login',exportInfluencerScanLogin);


reportRouter.get('/state_kyc_status',stateKycStatus);
reportRouter.post('/export_state_kyc_status',exportStateKycStatus);

reportRouter.get('/state_wise_login_ageing',stateWiseLoginAgeing);
reportRouter.post('/export_state_wise_login_ageing',exportStateWiseLoginAgeing);


reportRouter.get('/category_wise_scan_report', categoryWiseScanReport);
reportRouter.post('/export_category_wise_scan_report', exportCategoryWiseScanReport);

reportRouter.get('/monthly_scan_ageing', monthlyScanAgeing);
reportRouter.post('/export_monthly_scan_ageing', exportMonthlyScanAgeing);

reportRouter.get('/scan_point_report',scanPointReportProductWise);
reportRouter.post('/export_scan_point_report',exportScanPointReportProductWise);

export default reportRouter;