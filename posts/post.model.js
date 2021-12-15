const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    _id: { type: String, unique: true },
    categoryId: { type: String, required: true },
    title: { type: String, required: true },
    lead: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail_url: { type: String, required: true },
    createdAt: Date,
    publish_time: { type: String, required: true },
});

module.exports = new mongoose.model("Post", postSchema);
