const express = require('express')
const router = express.Router()
const { auth, auth_role } = require('../middlewares/auth')
const userController = require('../controllers/user.controller')
router.get('/getCurrentUser', auth, userController.getCurrentUser)
router.get(
  '/getAllUsers',
  auth,
  auth_role(['admin']),
  userController.getAllUser
)

module.exports = router
