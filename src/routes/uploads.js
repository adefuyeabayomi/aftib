
const express = require('express');
const { saveListingImages } = require('../controllers/uploads');
const uploadImages = require('../functions/fileupload.middleware') 

const router = express.Router()

// Apply the upload middleware specifically to this route
router.post('/addListingImag/:id', uploadImages, saveListingImages)

module.exports = router;
