const mongoose = require('mongoose')

const postCommentSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true
    },
    postId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    subComments: [{
        userId: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: new Date()
        }
    }]
}, { _id: false, timestamps: true });

module.exports = mongoose.model('PostComment', postCommentSchema)