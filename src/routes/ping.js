
const router = require("express").Router();
const verifyToken = require('../functions/verifyToken.middleware')
const { ping, getAccessLog, clearUsers, clearListings, clearAgentRequests,clearTransactions, clearHotels,checkSession } = require("../controllers/ping");

router.get("/", ping);
router.get("/accesslog", getAccessLog);
router.delete('/clear-users',clearUsers);
router.delete('/clear-listings',clearListings)
router.delete('/clear-transactions',clearTransactions)
router.delete('/clear-agent-request',clearAgentRequests)
router.delete('/clear-hotel',clearHotels)
router.get('/check-session',verifyToken,checkSession)

module.exports = router;
