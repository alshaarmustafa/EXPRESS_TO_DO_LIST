const User = require("../models/user");
const AppError = require('../utils/AppError');
const bcrypt = require("bcrypt");
const asyncWrapper = require('../middleware/asyncWrapper');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');
const mongoose = require('mongoose');

const getAllUsers = asyncWrapper(async (req, res, next) => {
    // const query = req.query;
    // const limit = query.limit || 10;
    // const page = query.page || 1;
    // const skip = (page - 1) * limit;
    const users = await User.find({}, { "__v": false, 'password': false ,"token":false})
    // .limit(limit).skip(skip);

    res.json({ status: "success", message: "Retrieved users successfully!", data: users });
    //
})

const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password , role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("This email is already exists please login with different email", 400));
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ firstName, lastName, email, password: hashedPassword ,role});
    const token = await generateJWT({ email: user.email, id: user._id ,role:user.role});
    user.token = token;
    console.log(token);
    await user.save();
    res.status(201).json({ status: "success", message: "user registered successfully!", token })

})

const login = asyncWrapper(async (req, res, next) => {
    const { email, password ,role} = req.body;
    if (!email || !password) {
        return next(new AppError("email and password are required", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError("Wrong email or password", 400));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError("Wrong email or password", 400));
    }
    const token = await generateJWT({ email: user.email, id: user._id, role: user.role })
    res.status(200).json({ status: "success", message: "login successfully", data: { token ,role: user.role} })
})




const deleteUser= asyncWrapper(async(req ,res,next)=>{
    const { id }=req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid user ID", 400));
    const user=  await User.findByIdAndDelete(id) 
    if (!user) return next(new AppError("No user found with that ID", 404));
    res.status(200).json({ status: "success", message: "Deleted successfully!" })
})
 
const updateUser= asyncWrapper(async(req ,res,next)=>{
    const { id }=req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return next(new AppError("Invalid user ID", 400));
      if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 12);
  }
    const user=  await User.findByIdAndUpdate(id, req.body ,{new:true,runValidators:true}) 
    if (!user) return next(new AppError("No user found with that ID", 404));
    res.status(200).json({ status: "success", message: "Updated successfully!",data:user })
})

module.exports = { login, register, getAllUsers,deleteUser,updateUser }