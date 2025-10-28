import Joi from 'joi';

export const giftGallerySchema = Joi.object({
    created_by: Joi.number().optional().allow(null),
    created_by_name: Joi.string().max(30).optional().allow(null, ''),

    gift_type: Joi.string().valid('GIFT', 'CASH').optional(),
    influencer_type: Joi.string().optional(),

    title: Joi.string().max(200).optional().allow(null, ''),
    gift_point: Joi.number().optional().allow(null),
    gift_img: Joi.string().max(200).optional().allow(null, ''),
    termsNcondition: Joi.string().optional().allow(null, ''),

    range_start: Joi.number().optional().allow(null),
    range_end: Joi.number().optional().allow(null),
    point_range_value: Joi.number().optional().allow(null),

    offer_start_date: Joi.date().optional(),
    offer_end_date: Joi.date().optional().allow(null),

    status: Joi.boolean().optional(),
    last_status_changed_on: Joi.date().optional().allow(null),
    status_changed_by: Joi.number().optional().allow(null),
    status_changed_by_name: Joi.string().max(30).optional().allow(null, ''),

    del: Joi.boolean().optional()
});
