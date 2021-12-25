const express = require('express')
const env = require('dotenv')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
env.config()

// region routes
const PostCommentRoutes = require('./routes/postComment.route')
const TopicCommentRoutes = require('./routes/topicComment.route')

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database connected')
  })

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', PostCommentRoutes)
app.use('/api', TopicCommentRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
