const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    _id: { type: String, unique: true },
    name: {type: String, required: true, trim: true, default: ""},
    parent_id: {type: String, required: true, default: ""},
}, { timestamps: true });

module.exports = new mongoose.model("Category", categorySchema);
