const createError = require('http-errors')
const Posts = require('../models/post.model')
const Category = require('../models/category.model')
const slugify = require("slugify");
const {sendProducer} = require('../services/kafkaProducer')

class postController {
    // parentId tạo như thế nào?
    async addCategory(req, res, next) {
        try {
            const {slug, name, parentId} = req.body

            const newCategory = new Category({slug, name, parentId})
            await newCategory.save()

            // Kafka
            await sendProducer('createCategory', {categoryId: newCategory._id, slug, name, parentId})

            return res.status(200).json({success: true, message: "Add category successfull"})
        } catch (error) {
            next(createError(400, {success: false, message: error.message}))
        }
    }
    async updateCategory(req, res, next) {
        try {
            const categoryId = req.params.categoryId
            const update = req.body

            const updateCategory = await Category.updateOne({_id: categoryId}, {$set: {... update}})
            if (updateCategory.matchedCount === 0) {
                return next(createError(400, {success: false, message: "Can't find categoryId"}))
            }

            // Kafka
            await sendProducer('updateCategory', {categoryId, update})

            return res.status(200).json({success: true, message: "Update category successfull"})
        } catch (error) {
            next(createError(400, {success: false, message: error.message}))
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const categoryId = req.params.categoryId

            const deleteCategory = await Category.deleteOne({_id: categoryId})

            if (deleteCategory.deletedCount === 0) {
                return next(createError(400, {success: false, message: "Cant find category"}))
            }

            // Kafka
            await sendProducer('deleteCategory', {categoryId})

            return res.status(200).json({success: true, message: "Delete category successfull"})
        } catch (error) {
            next(createError(400, {success: false, message: error.message}))
        }
    }
}

module.exports = new postController()