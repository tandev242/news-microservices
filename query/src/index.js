const express = require('express')
const app = express()
const createError = require('http-errors')
const mongoose = require('mongoose')
require("dotenv").config()

const postRouter = require('./routes/post.route')
const PORT = process.env.PORT || 7000

app.use(express.json())

app.use('/api/post', postRouter)

require('./services/kafkaConsumer')

// Error 404 - Not found
app.use((req, res, next) => {
    next(createError.NotFound());
});

// Handle error middleware
app.use((err, req, res, next) => {
    console.log(err);
    // console.log(req.body);
    res.status(err.status || 500);
    res.json({ success: err.success, msg: err.message });
});

app.listen(PORT, () => {
    mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected");
    });

    console.log('Server is starting');
})