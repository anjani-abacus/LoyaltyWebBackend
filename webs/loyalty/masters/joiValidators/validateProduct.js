import Joi from 'joi';

export const ProductValidationSchema = Joi.object({

    category_id: Joi.number().required(),
    category_name:Joi.string().required(),
    sub_category_id: Joi.number().required(),
    sub_category_name: Joi.string().required(),
    product_code: Joi.string().max(200).required(),
    point_category_id: Joi.number().optional().allow(null),
    point_category_name: Joi.string().max(50).optional().allow(null, ''),
    product_grouping: Joi.string().max(50).optional().allow(null, ''),
    description: Joi.string().required(),
    product_name: Joi.string().max(200).required(),
    uom: Joi.string().valid('KG', 'SQFT', 'PCS', 'LTR').optional().messages({
        'string.base': `"uom" should be a type of 'text'`,
        'any.only': `"uom" must be one of [KG, SQFT, PCS, LTR]`,
        'any.required': `"uom" is a required field`
    }),
    status: Joi.number().optional(),
    small_packing_size: Joi.number().required(),
    master_packing_size: Joi.number().required(),
    small_packing_size_uom: Joi.string().valid('KG', 'SQFT', 'PCS', 'LTR').optional().messages({
        'string.base': `"uom" should be a type of 'text'`,
        'any.only': `"uom" must be one of [KG, SQFT, PCS, LTR]`,
        'any.required': `"uom" is a required field`
    }),
    master_packing_size_uom: Joi.string().valid('KG', 'SQFT', 'PCS', 'LTR').optional().messages({
        'string.base': `"uom" should be a type of 'text'`,
        'any.only': `"uom" must be one of [KG, SQFT, PCS, LTR]`,
        'any.required': `"uom" is a required field`
    }),
    qty: Joi.number().required(),
    mrp: Joi.number().required(),
    net_price: Joi.number().optional().allow(null),
    product_scan: Joi.string().max(50).optional().allow(null, ''),
    offer_name: Joi.string().max(100).optional().allow(null, ''),
    offer_group: Joi.string().max(100).optional().allow(null, ''),
    appOrderFlag: Joi.boolean().optional(),
    brand: Joi.string().max(255).required(),
    color: Joi.string().max(100).optional().allow(null, ''),
    boxWOItem: Joi.number().optional().allow(null),
    assign_unit: Joi.number().optional().allow(null),
    warranty_period: Joi.number().optional().allow(null),
    installation_responsibility: Joi.string().max(100).optional().allow(null, ''),
    slug: Joi.string().optional().allow(null, ''),
    insertFrom: Joi.string().max(50).optional().allow(null, ''),
    last_update_by: Joi.number().optional().allow(null),
    last_updated_by_name: Joi.string().max(100).optional().allow(null, ''),
    last_update_date: Joi.date().optional().allow(null),
    download: Joi.number().optional().allow(null),
    del: Joi.boolean().optional(),
    updateByIntegrationDate: Joi.date().optional().allow(null),
    feature: Joi.boolean().optional(),
    hsn_code: Joi.string().max(100).optional().allow(null, ''),
    stock: Joi.number().optional().allow(null),
    product_size: Joi.string().max(100).required(),
    product_thickness: Joi.string().max(100).optional(),
    sizes: Joi.string().optional().allow(null, ''),
    is_featured: Joi.boolean().optional(),
    feature_name: Joi.string().max(100).optional().allow(null, ''),
    feature_mrp: Joi.number().optional().allow(null),

});


