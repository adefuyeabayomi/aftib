const router = require("express").Router();

const { ping,getAccessLog } = require("../controllers/ping");


router.get("/", ping);
router.get("/accesslog",getAccessLog)

module.exports = router;
