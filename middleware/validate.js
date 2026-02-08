const AppError = require("../utils/AppError");

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (!error) return next();

        const errors = Object.fromEntries(
            error.details.map(e => [
                e.path.join("."),
                e.message.replace(/"/g, "")
            ])
        );

        return next(new AppError("Validation error", 400, errors));
    };
};

module.exports = validate;
