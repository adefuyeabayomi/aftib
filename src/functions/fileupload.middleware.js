// routes/uploads.js
const multer = require("multer");
const path = require("path");

const uploadImages = multer({
  dest: "uploadAssets/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: Images Only!");
    }
  },
}).array("files", 10);
module.exports = uploadImages;
