const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
  try {
    const token =
      req.headers['authorization'] && req.headers['authorization'].split(' ')[1]
    if (!token) return res.status(400).json({ msg: 'Invalid Authentication.' })

    // Check token valid
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    if (!decoded)
      return res.status(401).json({ msg: 'Invalid Authentication..' })

    req.user.userId = decoded._id
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, msg: err.message })
    }
    return res.status(401).json({ msg: err.message })
  }
}

module.exports = auth
