// routes/uploads.js
const multer = require('multer');
const path = require('path');
const express = require('express');
const { saveListingImages } = require('../controllers/uploads');

const uploadImages = multer({
    dest: 'uploadAssets/',
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
}).array('files', 10)

const router = express.Router()

// Apply the upload middleware specifically to this route
router.post('/addListingImages/:id', uploadImages, saveListingImages)

module.exports = router;
