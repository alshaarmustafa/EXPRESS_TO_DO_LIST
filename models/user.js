const mongoose = require("mongoose")
const validator = require('validator');
const userRoles = require("../utils/userRoles");


const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    token: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'filed must be a valid email address']
    },
    password: { type: String, required: true ,select:false},
    role: {
        type: String, // ["USER", "ADMIN", "MANAGER"]
        enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
        default: userRoles.USER
    }

}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.__v;
        }
    }

})

module.exports = mongoose.model('User', userSchema)