const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const { sendProducer } = require('../services/kafkaProducer')

const client_id = process.env.GOOGLE_CLIENT_ID
const client = new OAuth2Client(client_id)

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

const loginByGoogle = async (req, res) => {
  const { token } = req.body
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: client_id,
    })
    const { name, email, picture: avatar } = ticket.getPayload()
    const existingUser = await User.findOne({ email })
    // if user exists return token, else register
    if (existingUser) {
      const newToken = jwt.sign(
        { _id: existingUser._id, role: existingUser.role },
        process.env.JWT_SECRET
      )
      return res
        .status(200)
        .json({
          success: true,
          message: `login successfully`,
          token: newToken,
          user: existingUser,
        })
    } else {
      const password = 'DAsd312XXXzLMHxc@@sAA'
      const newUser = await User.create({ email, password, name, avatar })
      const newToken = jwt.sign(
        { _id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET
      )
      sendProducer('createUser', { newUser })
      return res
        .status(200)
        .json({
          success: true,
          message: `login successfully`,
          token: newToken,
          user: newUser,
        })
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

module.exports = { login, loginByGoogle }
