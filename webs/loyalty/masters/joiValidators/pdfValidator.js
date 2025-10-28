import Joi from 'joi';

export const documentCatalogueSchema = Joi.object({
    title: Joi.string().max(100).required(),
    doc: Joi.string().optional(),
    type: Joi.string().max(100).required(),
    del: Joi.boolean().optional()
});

