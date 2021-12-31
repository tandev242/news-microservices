const createError = require("http-errors");
const Posts = require("../models/post.model");
const Categories = require("../models/category.model");
const slugify = require("slugify");
const { sendProducer } = require("../services/kafkaProducer");
const { cloudinary, getPublicId } = require('../utils/cloudinary')

class postController {
    async addPost(req, res, next) {
        try {
            // console.log(req.file);
            // console.log(req.body);
            let {title, categoryId, lead, content} = req.body
            // console.log(title, categoryId, lead, content, thumbnailUrl);
            // categoryId = categoryId
            const result = await cloudinary.uploader.upload(req.file.path)
            let thumbnailUrl = result.url
            
            // Create slug
            let slug = slugify(title, {
                remove: undefined, // remove characters that match regex, defaults to `undefined`
                lower: true,      // convert to lower case, defaults to `false`
                strict: true,     // strip special characters except replacement, defaults to `false`
                locale: 'vi',       // language code of the locale to use
                trim: true         // trim leading and trailing replacement chars, defaults to `true`
            })

            const foundCategory = await Categories.findOne({id: categoryId})
            // console.log(foundCategory);

            if (!foundCategory) {
                return next(createError(400, {success: false, message: "Can't find category"}))
            }

            const newPost = new Posts({title, categoryId, slug, lead, content, thumbnailUrl})
            await newPost.save()

            // Kafka producer
            await sendProducer('createPost', {postId: newPost._id, title, categoryId, lead, content, thumbnailUrl})

            return res
                .status(200)
                .json({ success: true, message: "Add post successfull!" });
        } catch (error) {
            // console.log(error);
            next(createError(400, { success: false, message: error.message }));
        }
    }
    async updatePost(req, res, next) {
        try {
            const update = req.body;
            const postId = req.params.postId;

            if (update.categoryId) {
                const foundCategory = await Categories.findOne({
                    _id: categoryId,
                });
                if (!foundCategory) {
                    return next(
                        createError(400, {
                            success: false,
                            message: "Can't find category",
                        })
                    );
                }
            }

            if (update.title) {
                update.slug = slugify(update.title, {
                    remove: undefined, // remove characters that match regex, defaults to `undefined`
                    lower: true, // convert to lower case, defaults to `false`
                    strict: true, // strip special characters except replacement, defaults to `false`
                    locale: "vi", // language code of the locale to use
                    trim: true, // trim leading and trailing replacement chars, defaults to `true`
                });
            }

            const updatePost = await Posts.updateOne(
                { _id: postId },
                { $set: { ...update } }
            );
            if (updatePost.matchedCount === 0) {
                return next(
                    createError(400, {
                        success: false,
                        message: "Can't find postId",
                    })
                );
            }

            // Kafka
            await sendProducer("updatePost", { postId, update });

            return res
                .status(200)
                .json({ success: true, message: "Update post successfull" });
        } catch (error) {
            // console.log(error);
            next(createError(400, { success: false, message: error.message }));
        }
    }
    async deletePost(req, res, next) {
        try {
            const postId = req.params.postId;

            const deletePost = await Posts.deleteOne({ _id: postId });

            if (deletePost.deletedCount === 0) {
                return next(
                    createError(400, {
                        success: false,
                        message: "Cant find post",
                    })
                );
            }

            // Kafka
            await sendProducer("deletePost", { postId });

            return res
                .status(200)
                .json({ success: true, message: "Delete post successfull" });
        } catch (error) {
            // console.log(error);
            next(createError(400, { success: false, message: error.message }));
        }
    }
}

module.exports = new postController();
