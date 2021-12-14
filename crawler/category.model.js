const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryId: {type: String, unique: true},
    name: String,
    parent_id: String
})

module.exports = new mongoose.model('Category', categorySchema)