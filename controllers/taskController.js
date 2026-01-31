const Task = require('../models/task')
const AppError = require('../utils/AppError');
const mongoose = require('mongoose');
const asyncWrapper = require('../middleware/asyncWrapper');
//retrive tasks from DB
const getTasks = asyncWrapper(async (req, res, next) => {
    const tasks = await Task.find({ user: req.user._id }).populate('user', 'firstName lastName email');
    if (tasks.length === 0) return next(new AppError("No tasks found", 404));
    res.status(200).json({ status: "success", message: "Retrieved tasks successfully!", data: tasks })
})
//retrive one task by ID
const getTaskById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid task ID", 400));
    const task = await Task.findById(id);
    if (!task) return next(new AppError("No task found with that ID", 404));
    res.status(200).json({ status: "success", message: "Retrieved task successfully!", data: task })
})

//Create New Task And Save it In DB
const createTask = asyncWrapper(async (req, res, next) => {
    console.log("USER:", req.user);
    const { title, description, status, user } = req.body;
    const task = new Task({ title, description, status, user:req.user._id });
    await task.save();
    res.status(201).json({ status: "success", message: "Added successfuly!", data: task })
})
//Deleted Task from DB
const deleteTask = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid task ID", 400));
    const task = await Task.findByIdAndDelete(id)
    if (!task) return next(new AppError("No task found with that ID", 404));
    res.status(200).json({ status: "success", message: "Deleted successfuly!", data: null })
})
//Updated Task And Save change In DB
const updateTask = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    const dataToUpdate = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid task ID", 400));
    const task = await Task.findByIdAndUpdate(id, dataToUpdate, { new: true })
    if (!task) return next(new AppError("No task found with that ID", 404));
    res.status(200).json({ status: "success", message: "Updated successfuly!", data: task })
})



module.exports = { getTasks, getTaskById, createTask, deleteTask, updateTask }
