import Joi from 'joi';

export const upsertDesignationRoleSchema = Joi.object({
    module_id: Joi.number().integer().required(),
    module_name: Joi.string().max(100).required(),

    add: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required(),
    view: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required(),
    edit: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required(),
    delete: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required(),
    import: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required(),
    export: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required(),
    approval: Joi.alternatives().try(Joi.boolean(), Joi.string().valid('true', 'false'), Joi.number().valid(0, 1)).required()
});
