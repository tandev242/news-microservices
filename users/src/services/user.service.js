const { upload } = require('../utils/upload')
module.exports = { uploadAvatar: upload.single('avatar') }
