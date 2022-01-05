const Token = require('../models/token.model.js')
const { randomBytes } = require('crypto')
const User = require('../models/user.model')
const { sendMail, createOutput } = require('../services/mail.service')
const { cloudinary, getPublicId } = require('../utils/cloudinary')
const { sendProducer } = require('../services/kafkaProducer')
const bcrypt = require('bcrypt')


const signUp = async (req, res) => {
  const { email, password, name } = req.body
  try {
    const existUser = await User.findOne({ email })
    if (existUser) {
      return res.status(400).json({ success: false, msg: 'email exist' })
    }
    const newUser = await User.create({ email, password, name })
    sendProducer('createUser', { newUser })
    res
      .status(201)
      .json({ success: true, msg: 'create new account successfully' })
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message })
  }
}

const signUpForAdmin = async (req, res) => {
  const { email, password, name } = req.body
  if (!(req.user.role === 'admin')) {
    return res
      .status(403)
      .json({ success: false, msg: 'Authorization failure' })
  }
  try {
    const existUser = await User.findOne({ email })
    if (existUser) {
      return res.status(400).json({ success: false, msg: 'email exist' })
    }
    const newUser = await User.create({ email, password, name, role: 'admin' })
    sendProducer('createUser', { newUser })
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

    const output = createOutput(`http://localhost:3000/resetPassword/${token}`)
    sendMail(email, output)
    res.status(200).json({
      success: true,
      msg: 'we sent request for change password to your email. Please check your email for changing password in 5 minutes',
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
      return res
        .status(404)
        .json({ success: false, msg: 'token expire or not exist' })
    }
    const user = await User.findById(tokenRecord.userId)
    if (!user) {
      return res.status(404).json({ success: false, msg: 'user is not found' })
    }
    user.password = newPassword
    const newUser = await user.save()
    await tokenRecord.remove()
    sendProducer('updateUser', { newUser })
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
    const newUser = await user.save()
    sendProducer('updateUser', { newUser })
    res.status(200).json({ success: true, avatar: result.url })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, msg: error.message })
  }
}

const update = async (req, res) => {
  try {
    const userId = req.params.userId
    // console.log(req.body);
    // console.log((req.file));
    const user = {...req.body, _id: userId};
    if (user.confirmPassword !== user.password) {
      return res.status(400).json({success: false, msg: 'confirmPassword must match password'})
    }
    const hashedPassword = await bcrypt.hash(user.password, 8)
    user.password = hashedPassword
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path)
      user.avatar = result.url
    }
    const update = await User.updateOne({_id: userId}, {$set: user})
    // console.log(update);
    if (update.modifiedCount === 1) {
      sendProducer('updateUser', {type: "update", newUser: {...user}})
      res.status(200).json({success: true, msg: "Update user successful"})
    }
    else {
      res.status(400).json({success: false, msg: "Cant update"})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, msg: error.message })
  }
}

module.exports = {
  signUp,
  forgotPassword,
  resetPassword,
  uploadAvatar,
  signUpForAdmin,
  update
}
