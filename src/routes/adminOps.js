const express = require('express');
const router = express.Router();
const verifyToken = require('../functions/verifyToken.middleware');
const uploadImages = require('../functions/fileupload.middleware');
const { 
  requestAgencyStatus,
  updateAgencyStatusPassport,
  updateAgencyStatusIssuedId,
  updateAgencyStatus,
  approveAgencyRequest,
  getAgencyRequestById,
  getAgencyRequests
} = require("../controllers/adminOps");

router.post("/request-agency-status", verifyToken, requestAgencyStatus);
router.post(
  "/update-agency-status-passport",
  verifyToken,
  uploadImages,
  updateAgencyStatusPassport
);
router.post(
  "/update-agency-status-issuedId",
  verifyToken,
  uploadImages,
  updateAgencyStatusIssuedId
);
router.put("/update-agency-status", verifyToken, updateAgencyStatus);
router.put("/approve-agency-request/:requestId", verifyToken, approveAgencyRequest);
router.get('/get-agency-request/:id', getAgencyRequestById);
router.get("/agency-requests", getAgencyRequests);


module.exports = router;

