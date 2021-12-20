const PostComment = require('../models/postComment.model')

const addPostComment = async (req, res) => {
    const { postId, content } = req.body;
    const userId = req.user._id;
    try {
        const postComment = new PostComment({ postId, userId, content });
        await postComment.save();
        res.status(201).json({
            success: true,
            message:
                'Comment has been created successfully'
        })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

const addSubPostComment = async (req, res) => {
    const { _id, content } = req.body;
    const userId = req.user._id;
    try {
        await PostComment.updateOne({ _id },
            { $push: { subComments: { userId, content } } },
            { new: true, upsert: true });
        res.status(201).json({
            success: true,
            message:
                'Sub comment has been created successfully'
        })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

module.exports = {
    addPostComment,
    addSubPostComment
}
