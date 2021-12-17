const multer = require('multer')

const storage = multer.diskStorage({})

const upload = multer({
  storage,
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file) {
      return cb(null, false)
    }
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(null, false)
    }
    cb(undefined, true)
  },
})

module.exports = { upload }
