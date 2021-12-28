const mongoose = require('mongoose')
const tokenSchema = new mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    token: {
      type: 'string',
      required: true,
    },
    expireAt: {
      type: Date,
      /* Defaults 7 days from now */
      default: Date.now(),
      /* Remove doc 60 seconds after specified date */
      expires: 5 * 60,
    },
  },
  { timestamps: true }
)
const Token = mongoose.model('Tokens', tokenSchema)
module.exports = Token
