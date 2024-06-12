const multer = require('multer')
const upload = multer({dest: 'uploadAssets/'}).array('files',10)
module.exports = upload