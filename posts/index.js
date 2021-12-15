const express = require("express");
const kafka = require("kafka-node");
const fs = require("fs").promises;
const Consumer = kafka.Consumer;
const mongoose = require("mongoose");
const client = new kafka.KafkaClient({ kafkaHost: "127.0.0.1:9092" });
const option = {
    groupId: "kafka-node-group", //consumer group id, default `kafka-node-group`
    // Auto commit config
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
    fetchMaxWaitMs: 100,
    // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
    fetchMinBytes: 1,
    // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
    fetchMaxBytes: 1024 * 1024,
    // If set true, consumer will fetch message from the given offset in the payloads
    fromOffset: false,
    // If set to 'buffer', values will be returned as raw buffer objects.
    encoding: "utf8",
    keyEncoding: "utf8",
};

const Post = require("./post.model");
const Category = require("./category.model");

const consumer = new Consumer(
    client,
    [{ topic: "post" }, { topic: "category" }],
    option
);
let a = 1;
consumer.on("message", async (message) => {
    console.log(a);
    a++;
    await fs.writeFile("./test.json", message.value);

    switch (message.topic) {
        case "category":
            const categoryList = JSON.parse(message.value);
            try {
                await Category.create(categoryList);
            } catch (error) {
                if (error.code !== 11000) {
                    console.log(error);
                }
            }

            break;

        case "post":
            const postList = JSON.parse(message.value);
            try {
                await Post.create(postList);
            } catch (error) {
                if (error.code !== 11000) {
                    console.log(error);
                }
            }

            break;

        default:
            break;
    }
});

const app = express();

app.use(express.json());

app.listen(process.env.PORT || 3001, () => {
    try {
        mongoose.connect("mongodb://localhost:27017/crawl", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to database");
    } catch (error) {
        console.log(error);
    }
    console.log("Server is starting");
});
