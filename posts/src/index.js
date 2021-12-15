const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
env.config();

mongoose
    .connect(
        process.env.CONNECTION_STRING,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(() => {
        console.log("Database connected");
    });


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./services/kafka");

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})