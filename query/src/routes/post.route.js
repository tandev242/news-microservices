const router = require('express').Router()
const postController = require('../controllers/post.controller')

// Lấy chi tiết bài post theo slug
router.get('/getPostBySlug/:slug', postController.getPostBySlug)

// Lấy 10 post mới nhất
router.get('/getLastPosts', postController.getLastPosts)

// Lấy tất cả post
router.get('/getAllPosts', postController.getAllPosts)
router.get('/getAllPosts100', postController.getAllPosts100)

// Lấy 4 post dựa theo slug của category. Hiển thị ở trang chủ
router.get('/getPostsByCategory/:slug', postController.getPostsByCategory)
router.get('/getPostsByCategory50/:slug', postController.getPostsByCategory50)

// Lấy list category để hover ở trang chủ
router.get('/getListCategory', postController.getListCategory)

// Lấy all post theo slug category (50 post)
router.get('/getAllPostsByCategory/:slug/:subSlug', postController.getAllPostsByCategory)

module.exports = router
