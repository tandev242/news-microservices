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

const { isAdmin } = require('../middleware/authorization')

const userController = require('../controller/user.controller.js')

router.post(
  '/signUp',
  registerSchema,
  validateRequestSchema,
  userController.signUp
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

router.get('/getAllUsers', passport.authenticate('jwt', { session: false }),isAdmin,userController.getAllUsers)
router.get('/',passport.authenticate('jwt', { session: false }),userController.getCurrentUser)

module.exports = router
