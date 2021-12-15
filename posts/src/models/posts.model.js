const mongoose = require('mongoose');
const Category = require('./category.model')

const postSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    lead: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    content: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    thumbnail_url: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },
    categoryId: {
        type: String,
        ref: 'Category',
        required: true
    },
}, { timestamps: true , _id: false});

module.exports = mongoose.model('Post', postSchema);