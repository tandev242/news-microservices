const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    _id: {type: String, unique: true},
    name: String,
    parent_id: String
}, {_id: false})

module.exports = new mongoose.model('Category', categorySchema)