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
  getUnapprovedAgencyRequests,
  getApprovedAgencyRequests,
  searchForAgent,
  getAgencyRequestByToken,
  rejectAgencyRequest,
  sendContactForm
} = require("../controllers/adminOps");

router.post("/request-agency-status", verifyToken, requestAgencyStatus)
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
router.put("/reject-agency-request/:requestId", verifyToken, rejectAgencyRequest);
router.get('/get-agency-request/:id', getAgencyRequestById);
router.get('/get-agency-request-by-token',verifyToken,getAgencyRequestByToken)
router.get('/get-unapproved-agency-requests',getUnapprovedAgencyRequests)
router.get('/get-approved-agency-requests',getApprovedAgencyRequests)
router.get('/search-for-agent',searchForAgent)
router.post('/send-contact-form',verifyToken, sendContactForm)

module.exports = router;

