const router = require('express').Router()
const {createNew, updateListing,getListingById,deleteListingById,getListings,searchListings} = require('../controllers/listing')

// [/listing/createNew] POST 201 Created | 400 bad request | 500 Internal Server Error
router.post("/createNew",createNew)

// [/listing/updateListing/:id] PUT 200 | 400 bad request
router.put("/updateListing/:id",updateListing)

// [/listing/getListingsById/:id]   200 Okay | 400 bad request
router.get("/getListingById/:id",getListingById)

// [/listing/deleteListingsById/:id]   200 Okay | 400 bad request
router.delete("/deleteListingById/:id",deleteListingById)

// [/listing/getListings/:sectionNo]   200 Okay | 400 bad request
router.get("/getListings/:sectionNo",getListings)

// [/listing/searchListings]   200 Okay | 400 bad request
router.get("/searchListings", searchListings)

// [/listing/]   200 Okay | 400 bad request

//
module.exports = router