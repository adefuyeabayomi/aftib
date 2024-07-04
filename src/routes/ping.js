
const router = require("express").Router();

const { ping, getAccessLog, clearUsers, clearListings, clearAgentRequests,clearTransactions, clearHotels } = require("../controllers/ping");

router.get("/", ping);
router.get("/accesslog", getAccessLog);
router.delete('/clear-users',clearUsers);
router.delete('/clear-listings',clearListings)
router.delete('/clear-transactions',clearTransactions)
router.delete('/clear-agent-request',clearAgentRequests)
router.delete('/clear-hotel',clearHotels)

module.exports = router;
