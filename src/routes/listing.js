const router = require("express").Router();
const {
  createNew,
  updateListing,
  getListingById,
  deleteListingById,
  getListings,
  searchListings,
  addListingImages,
  getUnapprovedListing,
  approveListing
} = require("../controllers/listing");
const uploadImages = require("../functions/fileupload.middleware");
const verifyToken = require("../functions/verifyToken.middleware");

// [/listing/createNew] POST 201 Created | 400 bad request | 500 Internal Server Error
router.post("/addListing", verifyToken, createNew);

// [/listing/updateListing/:id] PUT 200 | 400 bad request
router.put("/updateListing/:id", verifyToken, updateListing);

// [/listing/getListingsById/:id]   200 Okay | 400 bad request
router.get("/getListingById/:id", getListingById);

// [/listing/deleteListingsById/:id]   200 Okay | 400 bad request
router.delete("/deleteListingById/:id", verifyToken, deleteListingById);

// [/listing/getListings/:sectionNo]   200 Okay | 400 bad request
router.get("/getListings/:sectionNo", getListings);

// [/listing/searchListings]   200 Okay | 400 bad request
router.get("/searchListings", searchListings);

// [/listing/searchListings]   200 Okay | 400 bad request
router.get("/unApprovedListings", getUnapprovedListing);

router.put('/approveListing/:id',verifyToken,approveListing)

// [/listing/]   200 Okay | 400 bad request
router.put(
  "/addListingImages/:id",
  verifyToken,
  uploadImages,
  addListingImages,
)

module.exports = router;
