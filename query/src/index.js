const express = require('express')
const app = express()
const createError = require('http-errors')
const mongoose = require('mongoose')
require('dotenv').config()
const userRouter = require('./routes/user.route')

const Posts = require('./models/post.model')
const PORT = process.env.PORT || 7000

app.use(express.json())

app.get('/api/query/post', async (req, res, next) => {
  try {
    const foundPost = await Posts.find().populate('categoryId')
    return res.status(200).json({ success: true, data: foundPost })
  } catch (error) {
    return next(createError(400, { success: false, message: error.message }))
  }
})

require('./services/kafkaConsumer')

app.use('/api/users', userRouter)
// Error 404 - Not found
app.use((req, res, next) => {
  next(createError.NotFound())
})

// Handle error middleware
app.use((err, req, res, next) => {
  console.log(err)
  // console.log(req.body);
  res.status(err.status || 500)
  res.json({ success: err.success, msg: err.message })
})

app.listen(PORT, () => {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database connected')
    })

  console.log('Server is starting')
})
