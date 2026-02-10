const User = require("../models/user");
const AppError = require('../utils/AppError');
const bcrypt = require("bcrypt");
const asyncWrapper = require('../middleware/asyncWrapper');
const mongoose = require('mongoose');

const getAllUsers = asyncWrapper(async (req, res, next) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, 'password': false, "token": false })
        .limit(limit).skip(skip);

    res.json({ status: "success", message: "Retrieved users successfully!", data: users });

})

const deleteUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid user ID", 400));
    const user = await User.findByIdAndDelete(id)
    if (!user) return next(new AppError("No user found with that ID", 404));
    res.status(200).json({ status: "success", message: "Deleted successfully!" })
})

const updateUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid user ID", 400));
        if (req.user._id.toString() !== id && req.user.role !== "ADMIN") {
        return next(new AppError("You are not allowed to update this user", 403));
    }
    if (req.file) {
        req.body.avatar = req.file.path;
    }
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 12);
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    if (!user) return next(new AppError("No user found with that ID", 404));
    res.status(200).json({ status: "success", message: "Updated successfully!", data: user })
})
const getSingleUser = asyncWrapper(async (req, res, next) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid user ID", 400));
    const user = await User.findById(id, { "__v": false, 'password': false, "token": false })
    if (!user) return next(new AppError("No user found with that ID", 404));
    res.status(200).json({ status: "success", message: "Retrieved successfully!", data: user })
})

module.exports = { getAllUsers, deleteUser, updateUser, getSingleUser }