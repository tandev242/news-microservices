const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, errors: 'email or password incorrect' })
    }
    const isMatchPassword = await user.comparePassword(password)
    if (!isMatchPassword) {
      return res
        .status(400)
        .json({ success: false, errors: 'email or password incorrect' })
    }
    const token = jwt.sign({ data: user._id }, process.env.JWT_SECRET)
    return res
      .status(200)
      .json({ success: true, message: `login successfully`, data: { token } })
  } catch (error) {
    res.status(400).json({ success: false, errors: error.message })
  }
}

module.exports = { login }
