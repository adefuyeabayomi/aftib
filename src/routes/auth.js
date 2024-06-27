const router = require("express").Router();

const { login, signup, verifyEmail, getUser, sendOTPForgotPassword,verifyOtp } = require("../controllers/auth");
const verifyToken = require('../functions/verifyToken.middleware')

router.post("/login", login);

router.post("/signup", signup);

router.get("/verify-email/:id", verifyEmail);

router.get('/get-user',verifyToken, getUser)

router.get('/send-forgotpassword-otp/:email', sendOTPForgotPassword)

router.get('/verify-otp/:email/:otp',verifyOtp)

router.post('/auth/change-password/:email', changePasswordByEmail);

module.exports = router;
