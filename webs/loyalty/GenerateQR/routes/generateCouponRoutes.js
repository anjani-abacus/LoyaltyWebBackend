import express from 'express';
import { createqrTemplate, getAllQrTemplates, softDeleteQrTemplate } from '../controller/qrTemplatesController.js';
import upload from '@shared/middlewares/multerS3.js';
import { generateCoupons, getAllCouponHistory, getAllOfferCouponHistoryList, softDeleteOfferCouponHistory } from '../controller/offerCouponController.js';
import { createScannedCoupon, getAllScannedCoupon } from '../controller/scannedCouponController.js';
import { qrTemplateSchema   } from '../joiValidators/qrtemplateValidator.js';
import { offerCouponSchema} from '../joiValidators/couponValidators.js';
import { offerCouponScanSchema } from '../joiValidators/scanValidator.js';
import { validateBody } from '@shared/common/validateBody.js';
import { validateParam } from '@shared/common/validateParam.js';
import { idParamSchema } from '@shared/common/idParamSchema.js';
import { authenticateToken } from '@shared/middlewares/authenticateToken.js';
import { setUserContext } from "@shared/dbConfig/database.js";

const couponRouter = express.Router();

// qr_templates
couponRouter.post('/create_qr_template', upload.single('temp_image'), authenticateToken ,validateBody(qrTemplateSchema),createqrTemplate);
couponRouter.get('/getAll_qr_template',getAllQrTemplates);
couponRouter.delete('/delete_qr_template/:id',validateParam(idParamSchema,'id'),softDeleteQrTemplate);

// offer_coupons Generation
couponRouter.post('/create_coupon',validateBody(offerCouponSchema),authenticateToken,setUserContext,generateCoupons);
couponRouter.post('/get_all_coupon_history',getAllCouponHistory);
couponRouter.post('/get_all_offer_coupon_history_list',getAllOfferCouponHistoryList);
couponRouter.delete('/delete_coupon_history/:id',validateParam(idParamSchema,'id'),softDeleteOfferCouponHistory);

// scanned_coupons
couponRouter.post('/create_scanned_coupon', validateBody(offerCouponScanSchema),createScannedCoupon);
couponRouter.post('/get_all_scanned_coupon',getAllScannedCoupon);


export default couponRouter;