const express = require('express')
const { isVerify } = require('../middlewares/auth')

const router = express.Router()
const {
  validateRequestSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validator/validateRequestSchema')
const userController = require('../controller/user.controller')

router.post('/login', loginSchema, validateRequestSchema, userController.login)
router.post(
  '/refreshToken',
  refreshTokenSchema,
  validateRequestSchema,
  userController.refreshToken
)
router.post('/google', userController.loginByGoogle)
router.post('/refreshToken', userController.refreshToken)
router.delete('/logout', isVerify, userController.logout)

module.exports = router
