const TopicComment = require('../models/topicComment.model');

const addTopicComment = async (req, res) => {
    const { postId, content, parentId } = req.body;
    const userId = req.user._id;
    try {
        const topicComment = new TopicComment({ postId, userId, content, parentId });
        await topicComment.save();
        res.status(201).json({
            success: true,
            message:
                'Topic Comment has been created successfully'
        })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

const addSubTopicComment = async (req, res) => {
    // _id is id of topic 
    const { _id, content } = req.body;
    const userId = req.user._id;
    try {
        await TopicComment.updateOne({ _id },
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
    addSubTopicComment,
    addTopicComment
}
