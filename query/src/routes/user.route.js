const express = require('express')
const router = express.Router()
const { auth } = require('../middlewares/auth')
const userController = require('../controller/user.controller')
router.get('/getCurrentUser', auth, userController.getCurrentUser)

module.exports = router
