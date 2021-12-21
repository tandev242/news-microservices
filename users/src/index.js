require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const userRouter = require('./router/user.router')
const morgan = require('morgan')
const passport = require('passport')
require('./services/passport.service')(passport)
require('./services/kafkaProducer')

const port = process.env.PORT || 5000
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected')
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/user', userRouter)
app.use(morgan('combined'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
