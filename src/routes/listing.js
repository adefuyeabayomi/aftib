const readListing = require("express").Router()
const writeListing = require("express").Router()
const {
  createNew,
  updateListing,
  getListingById,
  deleteListingById,
  getListings,
  searchListings,
  addListingImages
} = require("../controllers/listing");
const uploadImages = require('../functions/fileupload.middleware') 

// [/listing/createNew] POST 201 Created | 400 bad request | 500 Internal Server Error
writeListing.post("/addListing", createNew)

// [/listing/updateListing/:id] PUT 200 | 400 bad request
writeListing.put("/updateListing/:id", updateListing)

// [/listing/getListingsById/:id]   200 Okay | 400 bad request
readListing.get("/getListingById/:id", getListingById)

// [/listing/deleteListingsById/:id]   200 Okay | 400 bad request
writeListing.delete("/deleteListingById/:id", deleteListingById)

// [/listing/getListings/:sectionNo]   200 Okay | 400 bad request
readListing.get("/getListings/:sectionNo", getListings)

// [/listing/searchListings]   200 Okay | 400 bad request
readListing.get("/searchListings", searchListings)

// [/listing/]   200 Okay | 400 bad request
writeListing.post("/addListingImages/:id",uploadImages,addListingImages)

//
module.exports = { writeListing, readListing };
