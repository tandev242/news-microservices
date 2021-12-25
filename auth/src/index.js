require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const authRouter = require('./router/auth.router')
// const morgan = require('morgan')
const cors = require('cors')

const port = process.env.PORT || 10000
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected')
  })
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/auth', authRouter)
// app.use(morgan('combined'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
