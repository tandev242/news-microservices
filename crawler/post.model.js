const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postId: {type: String, unique: true},
    categoryId: String,
    title: String,
    lead: String,
    content: String,
    thumbnail_url: String,
    createdAt: Date,
    publish_time: String
})

module.exports = new mongoose.model('Post', postSchema)