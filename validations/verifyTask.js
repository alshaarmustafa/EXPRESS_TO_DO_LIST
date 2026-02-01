const Joi = require('joi');
const AppError = require("../utils/AppError");
const taskStatus = require("../utils/taskStatus");

const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().allow("").max(500),
    status: Joi.string().valid(
        taskStatus.PENDING,
        taskStatus.IN_PROGRESS,
        taskStatus.COMPLETED
    )
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100),
    description: Joi.string().allow("").max(500),
    status: Joi.string().valid(
        taskStatus.PENDING,
        taskStatus.IN_PROGRESS,
        taskStatus.COMPLETED
    )
}).min(1); 
const createTaskVerify = (req, res, next) => {
    const { error } = createTaskSchema.validate(req.body, { abortEarly: false });

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

const updateTaskVerify = (req, res, next) => {
    const { error } = updateTaskSchema.validate(req.body, { abortEarly: false });

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

module.exports = { createTaskVerify, updateTaskVerify };

