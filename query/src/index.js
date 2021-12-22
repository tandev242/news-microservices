const express = require('express')
const app = express()
const createError = require('http-errors')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require("cors");

const userRouter = require('./routes/user.route')

const postRouter = require('./routes/post.route')
require('./services/kafkaConsumer')

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/api/post', postRouter)

app.use('/api/user', userRouter)
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

const PORT = process.env.PORT || 7000
app.listen(PORT, () => {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Database connected')
    })
  console.log('Server is starting on PORT: ' + PORT)
})
