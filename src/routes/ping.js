
const router = require("express").Router();

const { ping, getAccessLog, clearUsers, clearListings } = require("../controllers/ping");

router.get("/", ping);
router.get("/accesslog", getAccessLog);
router.delete('/clear-users',clearUsers);
router.delete('/clear-listings',clearListings);

module.exports = router;
