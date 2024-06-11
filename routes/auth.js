const router = require("express").Router();

const { login, signup, verifyEmail } = require("../controllers/auth");

router.post("/login", login);

router.post("/signup", signup);

router.get("/verify-email/:id", verifyEmail);

module.exports = router;
