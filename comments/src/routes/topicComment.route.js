const express = require('express');
const { addTopicComment, addSubTopicComment } = require('../controllers/topicComment.controller');
const { validateAddTopicCommentRequest, validateAddSubTopicCommentRequest, isRequestValidated } = require('../validators');
const { isVerify, isUserLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.post('/topicComment/addTopicComment',
    isVerify,
    isUserLoggedIn,
    validateAddTopicCommentRequest,
    isRequestValidated,
    addTopicComment)
router.post('/topicComment/addSubTopicComment',
    isVerify,
    isUserLoggedIn,
    validateAddSubTopicCommentRequest,
    isRequestValidated,
    addSubTopicComment)

module.exports = router;
