const TopicComment = require('../models/topicComment.model');
const { sendToConsumer } = require('../services/kafka')

const addTopicComment = async (req, res) => {
    const { postId, content, parentId } = req.body;
    const userId = req.user._id;
    try {
        const topicComment = new TopicComment({ postId, userId, content, parentId });
        await topicComment.save();

        await sendToConsumer('addTopicComment', { _id: topicComment._id, postId, userId, content, parentId });
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
        await TopicComment.findOneAndUpdate({ _id },
            { $push: { subComments: { userId, content } } },
            { new: true, upsert: true });

        await sendToConsumer('addSubTopicComment', { _id, userId, content });
        res.status(201).json({
            success: true,
            message:
                'Sub topic comment has been created successfully'
        })
    } catch (error) {
        res.status(500).json({ success: false, msg: error.message })
    }
}

module.exports = {
    addSubTopicComment,
    addTopicComment
}
