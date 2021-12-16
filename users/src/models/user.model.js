const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    default: '',
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  avatar: {
    type: String,
    required: true,
    default:
      'http://res.cloudinary.com/huy-tran/image/upload/v1639639979/q0apb6l1a5gk2xiq2alo.jpg',
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'],
    default: 'user',
  },
})

userSchema.pre('save', async function (next) {
  const user = this
  //ignore user created with no changed password
  if (!user.isModified('password')) return next()
  try {
    const hashedPassword = await bcrypt.hash(user.password, 8)
    user.password = hashedPassword
    next()
  } catch (error) {
    next(error)
  }
})
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
  } catch (error) {
    throw new Error(error.message)
  }
}

module.exports = new mongoose.model('user', userSchema)
