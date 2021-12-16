const mongoose = require('mongoose')

const postCommentSchema = new mongoose.Schema({
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
        timestamps: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('PostComment', postCommentSchema)