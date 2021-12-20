const router = require('express').Router()
const categoryController = require('../controllers/category.controller')
// const auth = require('../middlewares/auth')
// const auth_role = require('../middlewares/authRole')

const {validateBody} = require('../middlewares/validate')

router.post('/', /*auth, auth_role(['admin']),*/ validateBody('categorySchema'), categoryController.addCategory)
router.patch('/:categoryId', /*auth, auth_role(['admin']),*/ validateBody('categorySchema'), categoryController.updateCategory)
router.delete('/:categoryId', validateBody('categorySchema'), categoryController.deleteCategory)

module.exports = router