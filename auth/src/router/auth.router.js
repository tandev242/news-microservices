const express = require('express')
const router = express.Router()
const {
  validateRequestSchema,
  loginSchema,
} = require('../validator/validateRequestSchema')
const userController = require('../controller/user.controller')

router.post('/login', loginSchema, validateRequestSchema, userController.login)

module.exports = router