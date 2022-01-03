const User = require('../models/user.model')

const getDetailUser = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.params.userId})
    return res.status(200).json({ success: true, user: user })
  } catch (error) {
    return res.status(400).json({success: false, msg: error.message})
  }
}

const getCurrentUser = (req, res) => {
  return res.status(200).json({ success: true, user: req.user })
}
const getAllUsers = async (req, res) => {
  const users = await User.find()
  res.status(200).json({ success: true, users })
}
module.exports = { getCurrentUser, getAllUsers, getDetailUser }
