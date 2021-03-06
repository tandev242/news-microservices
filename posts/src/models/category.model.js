const mongoose = require('mongoose')
const { autoIncrement } =  require('mongoose-plugin-autoinc');

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    parentId: {
        type: String,
        required: true,
        default: ""
    }
}, { _id: false })

categorySchema.plugin(autoIncrement, {
    model: "Category",
    field: "_id",
    startAt: 1100000,
    incrementBy: 1
})

module.exports = new mongoose.model('Category', categorySchema)