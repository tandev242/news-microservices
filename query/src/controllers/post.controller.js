const express = require('express')
const createError = require('http-errors')
const Post = require('../models/post.model')
const Category = require('../models/category.model')
const PostComment = require('../models/postComment.model')
const TopicComment = require('../models/topicComment.model')
const mongoose = require('mongoose')


class postController {
    async getPostBySlug(req, res, next) {
        try {
            const {slug} = req.params
            console.log(slug);
            const foundPost = await Post.findOne({slug})

            if (!foundPost) return next(createError(404, {success:false, message: "Not found"}))

            const foundPostComment = await PostComment.find({postId: foundPost._id})

            const foundTopicComment = await TopicComment.find({postId: foundPost._id})

            return res.status(200).json({success: true, data: {...foundPost._doc, postComments: foundPostComment, topicComments: foundTopicComment}})
        } catch (error) {
            return next(createError(400, {success: false, message: error.message}))  
        }
    }
    async getLastPost(req, res, next) {
        try {
            const foundPost = await Post.find({}, {}, {sort: {"createAt": -1}}).limit(10)

            return res.status(200).json({success: true, data: foundPost})
        } catch (error) {
            return next(createError(400, {success: false, message: error.message}))  
        }
    }
    async getAllPost(req, res, next) {
        try {
            const foundPost = await Post.find()

            return res.status(200).json({success: true, data: foundPost})
        } catch (error) {
            return next(createError(400, {success: false, message: error.message}))  
            
        }
    }
    async getPostByCategory(req, res, next) {
        try {
            let {slug} = req.params
            slug = "/"+slug

            let foundCategory = await Category.findOne({slug, parentId: "1000000"})
            
            if (!foundCategory) return next(createError(404, {success:false, message: "Not found"}))

            let regex = new RegExp("^" + (foundCategory.parentId + "," + foundCategory._id)) 
            let foundSubCategory = await Category.find({parentId: regex})

            foundSubCategory.push(foundCategory)

            foundSubCategory = foundSubCategory.map((e) => e._id)
            // console.log(foundSubCategory);
            let foundPost = await Post.find({categoryId: {$in: foundSubCategory}}).limit(4)
            
            return res.status(200).json({success: true, data: foundPost})
        } catch (error) {
            return next(createError(400, {success: false, message: error.message}))  
            
        }
    }
    async getListCategory(req, res, next) {
        try {
            let foundParentCategory = await Category.find({parentId: "1000000"})

            // foundParentCategory = foundParentCategory.map(e => e.parentId = e.parentId + "," + e._id)
            // console.log(foundParentCategory);
            let foundListCategory = await Category.aggregate([
                {$match: {"parentId": {$in: foundParentCategory.map(e => e.parentId = e.parentId + "," + e._id)}}},
                {$group: {
                    _id: "$parentId",
                    data: {$push: "$$ROOT"}
                }}
            ])

            for (let el of foundListCategory) {
                let temp = foundParentCategory.map(e => {
                    // console.log(e.parentId);
                    if ((e.parentId) === el._id) {
                    el.name = e.name
                    el.parentId = e.parentId
                    el.slug = e.slug
                }})
                delete el._id
            }

            return res.status(200).json(foundListCategory)
        } catch (error) {
            return next(createError(400, {success: false, message: error.message}))  
            
        }
    }
    async getAllPostByCategory(req, res, next) {
        try {
            let {slug, subSlug} = req.params
            slug = "/"+slug
            if (subSlug) {
                slug = slug + '/' + subSlug
            }

            let foundCategory = await Category.findOne({slug})
            console.log(foundCategory);
            if (!foundCategory) return next(createError(404, {success:false, message: "Not found"}))

            let regex = new RegExp("^" + (foundCategory.parentId + "," + foundCategory._id)) 
            let foundSubCategory = await Category.find({parentId: regex})

            foundSubCategory.push(foundCategory)

            foundSubCategory = foundSubCategory.map((e) => e._id)
            // console.log(foundSubCategory);
            let foundPost = await Post.find({categoryId: {$in: foundSubCategory}}).limit(50)
            
            return res.status(200).json({success: true, data: foundPost})
        } catch (error) {
            return next(createError(400, {success: false, message: error.message}))  
        }
    }
}

module.exports = new postController()
