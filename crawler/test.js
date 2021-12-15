const mongoose = require("mongoose");
const Posts = require('./post.model')
try {
    mongoose.connect("mongodb://localhost:27017/crawl", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to database");
} catch (error) {
    console.log(error);
}

(async () => {
    const found = await Posts.findOne({_id: "4402086"}).populate('categoryId')
    console.log(found);
})();
