const Token = require('../models/token.model.js')
const { randomBytes } = require('crypto')
const User = require('../models/user.model')
const { sendMail, createOutput } = require('../services/mail.service')
const { cloudinary, getPublicId } = require('../utils/cloudinary')

const signUp = async (req, res) => {
  const { email, password, name, role } = req.body
  try {
    const existUser = await User.findOne({ email })
    if (existUser) {
      return res.status(400).json({ success: false, msg: 'email exist' })
    }
    const newUser = await User.create({ email, password, name, role })

    res
      .status(201)
      .json({ success: true, msg: 'create new account successfully' })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ success: false, msg: 'user not found' })
    }
    //delete old token if this user already has token
    await Token.findOneAndRemove({ userId: user._id })

    const token = randomBytes(16).toString('hex')
    await Token.create({
      userId: user._id,
      token,
    })
    const output = createOutput(`http://localhost:3000/reset-password/${token}`)
    sendMail(email, output)

    res.status(200).json({
      success: true,
      message:
        'please send patch request with newPassword to this link in 3 minute to reset password',
      data: { link: `http://localhost:3000/reset-password/${token}` },
    })
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message })
  }
}

const resetPassword = async (req, res) => {
  try {
    //string token
    const token = req.params.token
    const newPassword = req.body.newPassword

    //object token
    const tokenRecord = await Token.findOne({ token })
    if (!tokenRecord) {
      return res.status(404).json({ success: false, msg: 'token is not found' })
    }
    const user = await User.findById(tokenRecord.userId)
    if (!user) {
      return res.status(404).json({ success: false, msg: 'user is not found' })
    }
    user.password = newPassword
    await user.save()
    await tokenRecord.remove()
    res.status(200).json({ success: true, msg: 'update user successfully' })
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message })
  }
}

const uploadAvatar = async (req, res) => {
  try {
    const user = req.user
    const result = await cloudinary.uploader.upload(req.file.path)
    if (user.avatar !== process.env.DEFAULT_IMAGE && user.avatar) {
      await cloudinary.uploader.destroy(getPublicId(user.avatar))
    }
    user.avatar = result.url
    await user.save()
    res.status(200).json({ success: true, msg: 'update avatar successfully' })
  } catch (error) {
    console.log(error)
    res.status(200).json({ success: false, msg: error.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find()
    res.status(200).json({ success: true, data: allUsers })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

const getCurrentUser = (req, res) => {
  return req.user
}

module.exports = {
  signUp,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  getCurrentUser,
  getAllUsers,
}
