
export const validateParam = (schema, paramName = 'id') => (req, res, next) => {
    const { error } = schema.validate(req.params[paramName]);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }
    next();
};
