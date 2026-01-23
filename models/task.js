const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    compleated: { type: Boolean, default: false },
},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
            }
        }
    })

module.exports = mongoose.model('Task', taskSchema)