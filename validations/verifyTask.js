const Joi = require('joi');
const AppError = require("../utils/AppError");
const taskStatus = require("../utils/taskStatus");
const validate = require('../middleware/validate');

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
module.exports = {
  createTaskVerify: validate(createTaskSchema),
  updateTaskVerify: validate(updateTaskSchema),
};

