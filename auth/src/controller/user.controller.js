const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const { sendProducer } = require('../services/kafkaProducer')
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  deleteRefreshToken,
} = require('../services/authService')

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
    const accessToken = await generateAccessToken({
      _id: user._id,
      role: user.role,
    })
    const refreshToken = await generateRefreshToken({
      _id: user._id,
      role: user.role,
    })
    user.password = undefined
    return res.status(200).json({
      success: true,
      message: `login successfully`,
      accessToken,
      refreshToken,
      user,
    })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken
    const newAccessToken = await verifyRefreshToken(refreshToken)
    res.status(200).json({ newAccessToken })
  } catch (error) {
    res.status(400).json({ success: false, msg: error })
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
      const accessToken = await generateAccessToken({
        _id: existingUser._id,
        role: existingUser.role,
      })
      const refreshToken = await generateRefreshToken({
        _id: existingUser._id,
        role: existingUser.role,
      })
      return res.status(200).json({
        success: true,
        message: `login successfully`,
        accessToken,
        refreshToken,
        user: existingUser,
      })
    } else {
      const password = 'DAsd312XXXzLMHxc@@sAA'
      const newUser = await User.create({ email, password, name, avatar })
      const accessToken = await generateAccessToken({
        _id: newUser._id,
        role: newUser.role,
      })
      const refreshToken = await generateRefreshToken({
        _id: newUser._id,
        role: newUser.role,
      })
      sendProducer('createUser', { newUser })
      return res.status(200).json({
        success: true,
        message: `login successfully`,
        accessToken,
        refreshToken,
        user: newUser,
      })
    }
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

const logout = async (req, res) => {
  try {
    const userId = req.user._id
    await deleteRefreshToken(userId)
    res
      .status(200)
      .json({ success: true, msg: 'delete refresh token successfully' })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

module.exports = { login, loginByGoogle, refreshToken, logout }
