const router = require("express").Router();
const {
    createTransaction,
    initializePayment,
    checkPaymentStatus,
    checkRRRPaymentStatus
} = require("../controllers/transactions");
const verifyToken = require("../functions/verifyToken.middleware");

router.post('/create-transaction',verifyToken, createTransaction)

router.post('/initialize-payment',verifyToken, initializePayment)

router.post('/check-payment-status', verifyToken, checkPaymentStatus)

router.post('/check-rrr-payment-status', verifyToken, checkRRRPaymentStatus)

module.exports = router
