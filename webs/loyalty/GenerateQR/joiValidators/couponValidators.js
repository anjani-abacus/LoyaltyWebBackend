// offerCouponValidator.js
import Joi from 'joi';

export const offerCouponSchema = Joi.object({
    point_category_name: Joi.string().max(100).required(),
    point_category_id: Joi.number().required(),

    remark: Joi.string().required(),
    batch_name: Joi.string().optional(),
    product_mrp: Joi.number().required(),
    product_detail: Joi.string().required(),
    product_id: Joi.number().required(),

    coupon_qty: Joi.number().required(),
    product_qty: Joi.number().required(),
    paper_size: Joi.string().max(50).required(),  // Assuming it's a string like 'A4', 'A5', etc.
    template_id: Joi.number().required(),

    is_Scanned: Joi.boolean().optional(),

    reopned_by: Joi.number().optional().allow(null),
    reopned_date: Joi.date().optional().allow(null),

    del: Joi.boolean().optional()
});
