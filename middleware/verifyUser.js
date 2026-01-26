const Joi = require('joi');
const AppError = require("../utils/AppError");

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(20).required()
});

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(20).required(),
    birthDate: Joi.date().less('now').greater('1900-01-01').required(),
    gender: Joi.string().valid('male', 'female').required(),
});
const updateSchema = Joi.object({
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(5).max(20),
    birthDate: Joi.date().less('now').greater('1900-01-01'),
    gender: Joi.string().valid('male', 'female')
}).min(1);

const registerVerify = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = Object.fromEntries(
            error.details.map(e => [
                e.path[0],
                e.message.replace(/"/g, "")
            ])
        );

        return next(new AppError("Validation error", 400, errors));
    }

    next();
};

const loginVerify = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = Object.fromEntries(
            error.details.map(e => [
                e.path[0],
                e.message.replace(/"/g, "")
            ])
        );
        return next(new AppError("Validation error", 400, errors));
    }
    next();
}
const updateVerify = (req, res, next) => {
    const { error } = updateSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errors = Object.fromEntries(
            error.details.map(e => [
                e.path[0],
                e.message.replace(/"/g, "")
            ])
        );
        return next(new AppError("Validation error", 400, errors));
    }
    next();
}
module.exports = { registerVerify, loginVerify, updateVerify };