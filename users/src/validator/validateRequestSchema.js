const { validationResult, body } = require('express-validator')

const validateRequestSchema = (req, res, next) => {
  const errorsResult = validationResult(req)
  //raw errorResult contain value field so make sure to hide it
  const errors = errorsResult.array().map((error) => {
    const validError = { ...error }
    delete validError.value
    return validError
  })
  if (errors.length) {
    return res.status(400).json({ success: false, msg: errors[0].msg })
  }
  next()
}

const registerSchema = [
  body('name').isString().withMessage('your name is invalid'),
  body('email')
    .isEmail()
    .withMessage('email must contain a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 chars long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
]

const resetPasswordSchema = [
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 chars long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match password')
    }
    return true
  }),
]

const forgotPasswordSchema = [
  body('email')
    .isEmail()
    .withMessage('email must contain a valid email address'),
]

module.exports = {
  validateRequestSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
}
