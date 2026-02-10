const Joi = require('joi');
const AppError = require("../utils/AppError");
const validate = require('../middleware/validate');

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
    gender: Joi.string().valid('male', 'female'),
    avatar: Joi.string()
}).min(1);
module.exports = {
    registerVerify: validate(registerSchema),
    loginVerify: validate(loginSchema),
    updateVerify: validate(updateSchema),
};