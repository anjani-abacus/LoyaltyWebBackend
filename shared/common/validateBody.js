
export const validateBody = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = error.details.map((err) => ({
            field: err.path[0],
            message: err.message,
        }));
        return res.status(400).json({ success: false, errors });
    }
    req.body = value;
    next();
};
