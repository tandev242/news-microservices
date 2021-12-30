const createError = require('http-errors')
const Post = require('../models/post.model')
const Category = require('../models/category.model')
const PostComment = require('../models/postComment.model')
const TopicComment = require('../models/topicComment.model')

class postController {
    async getPostBySlug(req, res, next) {
        try {
            const { slug } = req.params
            console.log(slug);
            const foundPost = await Post.findOne({ slug })
                .populate({ path: "categoryId", select: "_id name slug" })

            if (!foundPost) return next(createError(404, { success: false, message: "Not found" }))

            const foundPostComment = await PostComment.find({ postId: foundPost._id })
                .populate({ path: "userId", select: "_id name avatar" })
                .populate({
                    path: 'subComments', populate: {
                        path: "userId", select: "_id name avatar"
                    }
                })
                .sort({ createdAt: -1 })

            const foundTopicComment = await TopicComment.find({ postId: foundPost._id })
                .populate("userId")
                .populate({
                    path: 'subComments', populate: {
                        path: "userId", select: "_id name avatar"
                    }
                })
                .sort({ createdAt: -1 })

            return res.status(200).json({ success: true, post: foundPost, postComments: foundPostComment, topicComments: foundTopicComment })
        } catch (error) {
            return next(createError(400, { success: false, message: error.message }))
        }
    }
    async getLastPosts(req, res, next) {
        try {
            const foundPosts = await Post.find({}, {}, { sort: { "createdAt": -1 } })
                .populate({ path: "categoryId", select: "_id name slug" })
                .limit(20)

            return res.status(200).json({ success: true, posts: foundPosts })
        } catch (error) {
            return next(createError(400, { success: false, message: error.message }))
        }
    }
    async getAllPosts(req, res, next) {
        try {
            const foundPost = await Post.find()
                .populate({ path: "categoryId", select: "_id name slug" })

            return res.status(200).json({ success: true, posts: foundPost })
        } catch (error) {
            return next(createError(400, { success: false, message: error.message }))

        }
    }
    async getPostsByCategory(req, res, next) {
        try {
            let { slug } = req.params
            slug = "/" + slug

            let foundCategory = await Category.findOne({ slug, parentId: "1000000" })

            if (!foundCategory) return next(createError(404, { success: false, message: "Not found" }))

            let regex = new RegExp("^" + (foundCategory.parentId + "," + foundCategory._id))
            let foundSubCategory = await Category.find({ parentId: regex })

            foundSubCategory.push(foundCategory)

            foundSubCategory = foundSubCategory.map((e) => e._id)
            // console.log(foundSubCategory);
            let foundPosts = await Post.find({ categoryId: { $in: foundSubCategory } })
                .populate({ path: "categoryId", select: "_id name slug" })
                .limit(4)

            return res.status(200).json({ success: true, posts: foundPosts, category: foundCategory })
        } catch (error) {
            return next(createError(400, { success: false, message: error.message }))

        }
    }
    async getListCategory(req, res, next) {
        try {
            let foundParentCategory = await Category.find({ parentId: "1000000" })

            // foundParentCategory = foundParentCategory.map(e => e.parentId = e.parentId + "," + e._id)
            // console.log(foundParentCategory);
            let foundListCategory = await Category.aggregate([
                { $match: { "parentId": { $in: foundParentCategory.map(e => e.parentId = e.parentId + "," + e._id) } } },
                {
                    $group: {
                        _id: "$parentId",
                        children: { $push: "$$ROOT" }
                    }
                }
            ])

            for (let el of foundListCategory) {
                let temp = foundParentCategory.map(e => {
                    // console.log(e.parentId);
                    if ((e.parentId) === el._id) {
                        el.name = e.name
                        el.parentId = e.parentId
                        el.slug = e.slug
                    }
                })
                delete el._id
            }

            return res.status(200).json({ success: true, categories: foundListCategory })
        } catch (error) {
            return next(createError(400, { success: false, message: error.message }))

        }
    }
    async getAllPostsByCategory(req, res, next) {
        try {
            let { slug, subSlug } = req.params
            slug = "/" + slug
            if (subSlug) {
                slug = slug + '/' + subSlug
            }

            let foundCategory = await Category.findOne({ slug })
            // console.log(foundCategory);
            if (!foundCategory) return next(createError(404, { success: false, message: "Not found" }))

            let regex = new RegExp("^" + (foundCategory.parentId + "," + foundCategory._id))
            let foundSubCategory = await Category.find({ parentId: regex })

            foundSubCategory.push(foundCategory)

            foundSubCategory = foundSubCategory.map((e) => e._id)
            // console.log(foundSubCategory);
            let foundPosts = await Post.find({ categoryId: { $in: foundSubCategory } })
                .populate({ path: "categoryId", select: "_id name slug" })
                .limit(50)

            return res.status(200).json({ success: true, posts: foundPosts, category: foundCategory })
        } catch (error) {
            return next(createError(400, { success: false, message: error.message }))
        }
    }
}

module.exports = new postController()
