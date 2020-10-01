const multer = require('multer')


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
  if(!allowedTypes.includes(file.mimetype)) {
    cb(null, false)
  } 

  cb(null, true) 
}

const limits = {
  fileSize: 64*1024 // 64 KB
}


module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter, limits
})