const User = require("../models/user");
const AppError = require('../utils/AppError');
const bcrypt = require("bcrypt");
const asyncWrapper = require('../middleware/asyncWrapper');
const generateJWT = require('../utils/generateJWT');


const register = asyncWrapper(async (req, res, next) => {
    const { firstName, lastName, email, password, role, birthDate, gender } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError("This email is already exists please login with different email", 400));
    }
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        birthDate,
        gender,
        avatar: req.file?.path
    });
    const token = await generateJWT({ email: user.email, _id: user._id, role: user.role });
    user.token = token;
    console.log(token);
    await user.save();
    res.status(201).json({ status: "success", message: "user registered successfully!", data: { token, avatar: user.avatar } })

})

const login = asyncWrapper(async (req, res, next) => {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new AppError("Wrong email or password", 400));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(new AppError("Wrong email or password", 400));
    }
    const token = await generateJWT({ email: user.email, _id: user._id, role: user.role })
    res.status(200).json({ status: "success", message: "login successfully", data: { token, role: user.role } })
})

module.exports = { login, register }