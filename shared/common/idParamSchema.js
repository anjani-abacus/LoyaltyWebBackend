import Joi from "joi";
export const idParamSchema = Joi.number().integer().positive().required();
