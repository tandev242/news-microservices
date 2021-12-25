const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const auth = async (req, res, next) => {
  try {
    const token =
      req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    if (!token)
      return res
        .status(400)
        .json({ success: false, msg: 'Invalid Authentication.' })
    // Check token valid
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decoded)
      return res
        .status(401)
        .json({ success: false, msg: 'Invalid Authentication..' })
    const user = await User.findById(decoded._id).select('-password')
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ msg: err.message })
  }
}
const auth_role = (permission) => {
  return (req, res, next) => {
    try {
      if (permission.includes(req.user.role)) next()
      else {
        return res.status(401).json({
          success: false,
          msg: 'You do not have permission to access this content',
        })
      }
    } catch (error) {
      return res.status(401).json({ success: false, msg: error.message })
    }
  }
}

module.exports = { auth, auth_role }
