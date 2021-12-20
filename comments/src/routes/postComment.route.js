const express = require('express');
const { addPostComment, addSubPostComment } = require('../controllers/postComment.controller');
const { validateAddPostCommentRequest, validateAddSubPostCommentRequest, isRequestValidated } = require('../validators');
const { isVerify, isUserLoggedIn, isAdminLoggedIn } = require('../middlewares/auth');

const router = express.Router();

router.post('/postComment/addPostComment',
    isVerify,
    isUserLoggedIn,
    validateAddPostCommentRequest,
    isRequestValidated,
    addPostComment)
router.post('/postComment/addSubPostComment',
    isVerify,
    isUserLoggedIn,
    validateAddSubPostCommentRequest,
    isRequestValidated,
    addSubPostComment)

module.exports = router;
