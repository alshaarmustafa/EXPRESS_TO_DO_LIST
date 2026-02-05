const mongoose = require("mongoose")
const validator = require('validator');
const userRoles = require("../utils/userRoles");


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    token: { type: String },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'filed must be a valid email address']
    },
    password: { type: String, required: true, select: false },
    role: {
        type: String, // ["USER", "ADMIN", "MANAGER"]
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
        default: userRoles.USER
    },
    birthDate: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female'], required: true },
    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: 'uploads/default.png' }
},
    {
        timestamps: true // createdAt & updatedAt 
    }, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }

})

module.exports = mongoose.model('User', userSchema)






