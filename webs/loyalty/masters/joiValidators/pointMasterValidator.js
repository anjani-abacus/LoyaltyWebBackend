import Joi from 'joi';

export const pointMasterUpsertSchema = Joi.object({

    created_by: Joi.number().integer().optional(),
    created_by_name: Joi.string().max(30).optional(),

    welcome_point: Joi.string().max(20).required(),
    birthday_point: Joi.string().max(10).required(),
    anniversary_point: Joi.string().max(10).required(),

    transaction_incentive: Joi.string().allow('', null).optional(),
    registration_refferal: Joi.string().required(),
    registration_refferal_own: Joi.string().required(),

    site_point: Joi.string().allow('', null).optional(),

    last_updated_by: Joi.number().integer().optional(),
    last_updated_by_name: Joi.string().max(30).optional()
});
