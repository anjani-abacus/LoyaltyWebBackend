import Joi from "joi";

export const userSchema = Joi.object({
    user_type: Joi.string().valid('Sales', 'System').required().label("User Type"), // adjust enum as per your schema

    designation_id: Joi.number().integer().required().label("Designation ID"),
    designation_name: Joi.string().trim().required().label("Designation Name"),

    name: Joi.string().trim().min(2).max(100).required().label("Name"),
    email: Joi.string().email().optional().allow(null, '').label("Email"),
    contact_01: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .label("Contact Number"),

    employee_id: Joi.string().trim().required().label("Employee ID"),

    date_of_birth: Joi.date().required().label("Date of Birth"),
    date_of_wedding: Joi.date().optional().allow(null, '').label("Date of Wedding"),
    date_of_joining: Joi.date().required().label("Date of Joining"),

    weekly_off: Joi.string().trim().required().label("Weekly Off"),
    reporting_Manager: Joi.string().trim().optional().allow(null, '').label("Reporting Manager"),

    state_name: Joi.string().trim().required().label("State"),
    district_name: Joi.string().trim().required().label("District"),
    city: Joi.string().trim().required().label("City"),
    pincode: Joi.string().pattern(/^[0-9]{6}$/).required().label("Pincode"),
    address: Joi.string().trim().required().label("Address"),

    working_state_name: Joi.string().trim().required().label("Working State"),
    working_district_name: Joi.string().trim().required().label("Working District"),


});
