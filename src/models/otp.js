const mongoose = require("mongoose");
let otpObject = {
    otp: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}
const otpSchema = mongoose.Schema(otpObject)
const otpModel = mongoose.model('OTP',otpSchema)
module.exports = otpModel
