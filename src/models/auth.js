const mongoose = require("mongoose")

let userSchema = new mongoose.Schema({
    email: String,
    hash: String,
    signupType: String,
    mobileNumber: String,
    name: String,
    userId: String
})

let userModel = mongoose.model('User', userSchema)

module.exports = userModel