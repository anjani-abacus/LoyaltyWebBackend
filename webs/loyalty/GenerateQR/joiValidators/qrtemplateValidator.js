// qrtemplateValidator.js
import Joi from 'joi';

export const qrTemplateSchema = Joi.object({
    created_by_id: Joi.number().optional().allow(null),
    created_by_name: Joi.string().max(50).optional().allow(null, ''),
    size: Joi.string().max(50).required(),
    del: Joi.boolean().optional()
});
