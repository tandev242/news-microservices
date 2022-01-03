const express = require('express')
const router = express.Router()
const { auth, auth_role } = require('../middlewares/auth')
const userController = require('../controllers/user.controller')
router.get('/getCurrentUser', auth, userController.getCurrentUser)
router.get('/getCurrentUser/:userId', auth, auth_role(['admin']), userController.getDetailUser)
router.get(
  '/getAllUsers',
  auth,
  auth_role(['admin']),
  userController.getAllUsers
)

module.exports = router
