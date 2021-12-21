const User = require('../models/user.model')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')

// TODO
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

const strategy = new JWTStrategy(opts, async (payload, done) => {
  try {
    const user = await User.findById(payload._id)

    if (user) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (error) {
    done(error, null)
  }
})

module.exports = (passport) => {
  passport.use(strategy)
}
