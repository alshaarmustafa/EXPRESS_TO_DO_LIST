const mongoose = require("mongoose")
const taskStatus = require("../utils/taskStatus");
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    status: {
        type: String,
        enum: [taskStatus.PENDING,
        taskStatus.IN_PROGRESS,
        taskStatus.COMPLETED],
        default: taskStatus.PENDING
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }

}, {
    timestamps: true // createdAt & updatedAt 
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        }
    })

module.exports = mongoose.model('Task', taskSchema)