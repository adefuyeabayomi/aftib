
const router = require("express").Router();

const { ping, getAccessLog, clearUsers, clearListings, populateListings } = require("../controllers/ping");

router.get("/", ping);
router.get("/accesslog", getAccessLog);
router.delete('/clear-users',clearUsers);
router.delete('/clear-listings',clearListings);
router.get('/populate-listings', populateListings)

module.exports = router;
