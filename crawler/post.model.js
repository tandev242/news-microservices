const mongoose = require('mongoose')
const Category = require('./category.model')

const postSchema = new mongoose.Schema({
    _id: {type: String, unique: true},
    categoryId: {type: String, ref: "Category"},
    title: String,
    lead: String,
    content: String,
    thumbnail_url: String,
    createdAt: Date,
    publish_time: String
}, {_id: false})

module.exports = new mongoose.model('Post', postSchema)