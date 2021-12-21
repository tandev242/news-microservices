const getCurrentUser = (req, res) => {
  console.log(req.user)
  return res.status(200).json({ success: true, user: req.user })
}
module.exports = { getCurrentUser }
