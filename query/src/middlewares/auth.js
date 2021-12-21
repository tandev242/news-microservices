const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const auth = async (req, res, next) => {
  try {
    const token =
      req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' })
    // Check token valid
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decoded)
      return res.status(401).json({ msg: 'Invalid Authentication..' })
    const user = await User.findOne({ _id: decoded._id }).select('-password')
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ msg: err.message })
  }
}

module.exports = { auth }
