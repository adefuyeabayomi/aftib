// functions/saveToCloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const saveToCloudinary = async (files) => {
    const uploadPromises = files.map(file => {
        return cloudinary.uploader.upload(file.path, {
            folder: 'listings'
        })
    })

    try {
        const results = await Promise.all(uploadPromises)
        return results.map(result => result.secure_url)
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error)
        throw new Error('Error uploading files')
    }
};

module.exports = saveToCloudinary;
