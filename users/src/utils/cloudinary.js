const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})
const getPublicId = (imageURL) => {
  const list = imageURL.split('/')
  const imageName = list[list.length - 1]
  return imageName.split('.')[0]
}
module.exports = { cloudinary, getPublicId }
