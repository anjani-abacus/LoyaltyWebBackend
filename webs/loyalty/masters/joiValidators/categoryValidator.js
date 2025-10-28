import Joi from 'joi';

export const validateCreateCategorySchema = Joi.object({
    category: Joi.string().required().messages({
        'any.required': 'Category is required',
        'string.empty': 'Category is required',
    }),
    direct_dealer_discount: Joi.number().min(0).required().messages({
        'number.base': 'Direct Dealer Discount must be a valid number',
        'number.min': 'Direct Dealer Discount must be a valid number',
        'any.required': 'Direct Dealer Discount is required',
    }),
    retailer_discount: Joi.number().min(0).required().messages({
        'number.base': 'Retailer Discount must be a valid number',
        'number.min': 'Retailer Discount must be a valid number',
        'any.required': 'Retailer Discount is required',
    }),
    gst: Joi.number().min(0).required().messages({
        'number.base': 'GST must be a valid number',
        'number.min': 'GST must be a valid number',
        'any.required': 'GST is required',
    }),
});
export const validateCreateSubCategorySchema = Joi.object({
    master_category_id: Joi.number().integer().min(1).required().messages({
        'number.base': 'Master Category ID must be a valid integer',
        'number.min': 'Master Category ID must be a valid integer',
        'any.required': 'Master Category ID is required',
    }),
    master_category_name: Joi.string().required().messages({
        'any.required': 'Master Category Name is required',
        'string.empty': 'Master Category Name is required',
    }),
    sub_category_name: Joi.string().required().messages({
        'any.required': 'Sub Category Name is required',
        'string.empty': 'Sub Category Name is required',
    }),
});
