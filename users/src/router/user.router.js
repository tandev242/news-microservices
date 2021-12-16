const express = require('express')
const router = express.Router()
const passport = require('passport')
const { uploadAvatar } = require('../services/user.service')
const {
  validateRequestSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
} = require('../validator/validateRequestSchema')

const userController = require('../controller/user.controller.js')

router.post(
  '/sign-up',
  registerSchema,
  validateRequestSchema,
  userController.signUp
)

router.post(
  '/forgot-password',
  forgotPasswordSchema,
  validateRequestSchema,
  userController.forgotPassword
)

router.patch(
  '/reset-password/:token',
  resetPasswordSchema,
  validateRequestSchema,
  userController.resetPassword
)

router.patch(
  '/upload-avatar',
  passport.authenticate('jwt', { session: false }),
  uploadAvatar,
  userController.uploadAvatar
)

module.exports = router
