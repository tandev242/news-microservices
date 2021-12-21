const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
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
      default: process.env.DEFAULT_IMAGE,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
)

module.exports = new mongoose.model('user', userSchema)
