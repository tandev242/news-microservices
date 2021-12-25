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
  '/signUp',
  registerSchema,
  validateRequestSchema,
  userController.signUp
)
router.post(
  '/signUpForAdmin',
  passport.authenticate('jwt', { session: false }),
  registerSchema,
  validateRequestSchema,
  userController.signUpForAdmin
)

router.post(
  '/forgotPassword',
  forgotPasswordSchema,
  validateRequestSchema,
  userController.forgotPassword
)

router.post(
  '/resetPassword/:token',

  resetPasswordSchema,
  validateRequestSchema,
  userController.resetPassword
)

router.post(
  '/uploadAvatar',
  passport.authenticate('jwt', { session: false }),
  uploadAvatar,
  userController.uploadAvatar
)

module.exports = router
