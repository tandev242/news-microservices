const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(401).json({ success: false, msg: 'not authorize' })
  } else {
    next()
  }
}
module.exports = { isAdmin }
