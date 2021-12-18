const express = require("express");
const env = require("dotenv");
const app = express();
const mongoose = require("mongoose");
env.config();
const createError = require('http-errors')

const postRouter = require("./routes/post.route");
const categoryRouter = require('./routes/category.route')

mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Database connected");
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/post", postRouter);
app.use("/api/category", categoryRouter);

require("./services/kafka");

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

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
