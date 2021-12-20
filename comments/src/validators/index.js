const { check, validationResult } = require('express-validator');

exports.validateAddPostCommentRequest = [
    check('postId')
        .notEmpty()
        .withMessage('PostId is required'),

    check('content')
        .notEmpty()
        .withMessage('Content is required ')
];

exports.validateAddSubPostCommentRequest = [
    check('_id')
        .notEmpty()
        .withMessage('_id is required'),

    check('content')
        .notEmpty()
        .withMessage('Content is required ')
];

exports.validateAddTopicCommentRequest = [
    check('postId')
        .notEmpty()
        .withMessage('PostId is required'),

    check('content')
        .notEmpty()
        .withMessage('Content is required ')
];

exports.validateAddSubTopicCommentRequest = [
    check('_id')
        .notEmpty()
        .withMessage('_id is required'),

    check('content')
        .notEmpty()
        .withMessage('Content is required ')
];



exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ success: false, msg: errors.array()[0].msg })
    }
    next();
}