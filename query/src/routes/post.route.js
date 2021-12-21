const router = require('express').Router()
const postController = require('../controllers/post.controller')

// Lấy chi tiết bài post theo slug
router.get('/getPostBySlug/:slug', postController.getPostBySlug)

// Lấy 10 post mới nhất
router.get('/lastPost', postController.getLastPost)

// Lấy tất cả post
router.get('/getAllPost', postController.getAllPost)

// Lấy 4 post dựa theo slug của category. Hiển thị ở trang chủ
router.get('/getPostByCategory/:slug', postController.getPostByCategory)

// Lấy list category để hover ở trang chủ
router.get('/getListCategory', postController.getListCategory)

// Lấy all post theo slug category (50 post)
router.get('/getAllPostByCategory/:slug', postController.getAllPostByCategory)
router.get('/getAllPostByCategory/:slug/:subSlug', postController.getAllPostByCategory)

module.exports = router