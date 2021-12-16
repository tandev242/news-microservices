const mongoose = require('mongoose')

const topicCommentSchema = new mongoose.Schema({
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
    }],
    parentId: [{
        type: String,
    }]
}, { timestamps: true });

module.exports = mongoose.model('TopicComment', topicCommentSchema)