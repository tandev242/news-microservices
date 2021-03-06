const router = require('express').Router()
const postController = require('../controllers/post.controller')
// const auth = require('../middlewares/auth')
// const auth_role = require('../middlewares/authRole')

const {validateBody} = require('../middlewares/validate')
const {upload} = require('../middlewares/upload')

router.post('/', /*auth, auth_role(['admin']),*/ upload.single('img'), postController.addPost)
router.patch('/:postId', /*auth, auth_role(['admin']),*/ validateBody('postSchema'), postController.updatePost)
router.delete('/:postId', validateBody('postSchema'), postController.deletePost)

module.exports = router