const multer = require('multer')
const path=require('path')
require ('dotenv').config()
const UPLOAD_DIR = process.env.UPLOAD_DIR

// const UPLOAD_DIR = path.join(process.cwd(), process.env.UPLOAD_DIR)
// const UPLOAD_DIR = path.join(process.cwd(), 'public/avatars')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}-${file.originalname}`);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
      if (file.mimetype.includes('image')) {

      cb(null, true);
      return;
    }
    const error = new Error('Wrong format file of avatar');
    error.status=HttpCode.BAD_REQUEST;
    cb(error);
  },
});
module.exports = upload;




