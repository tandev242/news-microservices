const mongoose = require("mongoose");
const { autoIncrement } =  require('mongoose-plugin-autoinc');

const postSchema = new mongoose.Schema({
    _id: {
        type: String,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        required: true,
        default: '',
    },
    title: {
        type: String,
        required: true,
        default: ''
    },
    lead: {
        type: String,
        required: true,
        default: ''
    },
    content: {
        type: String,
        required: true,
        default: ''
    },
    thumbnailUrl: {
        type: String,
        required: true,
        default: ''
    },
}, { _id: false, timestamps: true });

postSchema.plugin(autoIncrement, {
    model: "Post",
    field: "_id",
    startAt: 4600000,
    incrementBy: 1
})

module.exports = new mongoose.model("Post", postSchema);
