const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        required: true,
        ref: 'Category',
        default: '',
    },
    title: {
        type: String,
        required: true,
        default: ''
    },
    lead: {
        type: String,
        required: true,
        default: ''
    },
    content: {
        type: String,
        required: true,
        default: ''
    },
    thumbnailUrl: {
        type: String,
        required: true,
        default: ''
    },
}, { _id: false, timestamps: true });

module.exports = new mongoose.model("Post", postSchema);
