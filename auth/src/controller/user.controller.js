const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: 'email or password incorrect' })
    }
    const isMatchPassword = await user.comparePassword(password)
    if (!isMatchPassword) {
      return res
        .status(400)
        .json({ success: false, msg: 'email or password incorrect' })
    }
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET
    )
    user.password = undefined

    return res
      .status(200)
      .json({ success: true, message: `login successfully`, token, user })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

module.exports = { login }
