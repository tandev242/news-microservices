const { validationResult, body } = require('express-validator')

const loginSchema = [
  body('email')
    .isEmail()
    .withMessage('email must contain a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 chars long'),
]

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
module.exports = { validateRequestSchema, loginSchema }
