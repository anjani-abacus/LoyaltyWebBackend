// offerCouponScanSchema.js
import Joi from 'joi';

export const offerCouponScanSchema = Joi.object({
    transaction_id: Joi.string().max(150).required(),

    scanned_by: Joi.number().required(),
    scanned_by_name: Joi.string().max(50).required(),
    scanned_by_mobile: Joi.string().max(14).required(),
    scanned_by_type: Joi.string().max(100).optional().allow(null, ''),
    batch_name : Joi.string().max(100).optional(),

    influencer_type: Joi.string().max(30).required(),

    coupon_code: Joi.string().max(100).required(),

    point_category_name: Joi.string().max(100).required(),
    point_category_id: Joi.number().required(),

    product_detail: Joi.string().max(400).required(),

    coupon_value: Joi.number().required(),
    coupon_id: Joi.number().required(),

    state: Joi.string().max(100).required(),
    region: Joi.string().max(100).required(),
    category: Joi.string().max(100).required(),
    sub_category: Joi.string().max(100).required(),

    lat: Joi.string().max(60).optional().allow(null, ''),
    lng: Joi.string().max(60).optional().allow(null, ''),
    gps_address: Joi.string().optional().allow(null, ''),

    is_mobile_manual_scan: Joi.boolean().optional(),

    bonus_scheme_name: Joi.string().max(150).optional().allow(null, ''),
    bonus_scheme_id: Joi.number().optional().allow(null),

    badge_point: Joi.number().optional().allow(null),
    badge_scheme_name: Joi.string().max(100).optional().allow(null, ''),
    badge_scheme_id: Joi.number().optional().allow(null),

    del: Joi.boolean().optional()
});
