const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
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

module.exports = new mongoose.model('Category', categorySchema)