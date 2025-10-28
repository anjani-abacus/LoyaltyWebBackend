import Joi from "joi";

export const createModuleSchema = Joi.object({
    module_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .label("Module Name"),

    department_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .label("Department Name"),
    add: Joi.boolean().default(false),
    view: Joi.boolean().default(false),
    edit: Joi.boolean().default(false),
    delete: Joi.boolean().default(false),
    import: Joi.boolean().default(false),
    export: Joi.boolean().default(false),
    approval: Joi.boolean().default(false)    
});
