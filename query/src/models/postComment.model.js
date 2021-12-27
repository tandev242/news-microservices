const mongoose = require('mongoose')

const postCommentSchema = new mongoose.Schema({
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
}, { timestamps: true });

module.exports = mongoose.model('PostComment', postCommentSchema)