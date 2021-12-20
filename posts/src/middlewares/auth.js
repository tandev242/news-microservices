const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")

        if (!token) return res.status(400).json({ msg: "Invalid Authentication." })

        // Check token valid
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decoded) return res.status(401).json({ msg: "Invalid Authentication.." })

        req.user.userId = decoded._id
        next()
    } catch (err) {
        return res.status(401).json({ msg: err.message })
    }
}


module.exports = auth