const router = require("express").Router();

const { login, signup, verifyEmail, getUser, sendOTPForgotPassword,verifyOtp,changePasswordByEmail,updateUser,getAgentDashboardData, getAdminDashboardData,getUserById, getClientCount } = require("../controllers/auth");

const verifyToken = require('../functions/verifyToken.middleware')

router.post("/login", login);

router.post("/signup", signup);

router.get("/verify-email/:id", verifyEmail)

router.get('/get-user',verifyToken, getUser)

router.get('/get-user/:id', verifyToken, getUserById);

router.get('/send-forgotpassword-otp/:email', sendOTPForgotPassword)

router.get('/verify-otp/:email/:otp',verifyOtp)

router.post('/change-password/:email', changePasswordByEmail);

router.get('/get-agent-dashboard-data',verifyToken,getAgentDashboardData)

router.get('/get-admin-dashboard-data',verifyToken,getAdminDashboardData)

router.put('/update-user',verifyToken,updateUser)

router.get('/client-count', verifyToken, getClientCount);

module.exports = router;
