const mongoose = require("mongoose");
const saveToCloudinary = require("../functions/saveToCloudinary");
const getAddressLocationData = require('../functions/getAddressLocationData')
let Listing = require("../models/listing");
let User = require("../models/user");

const createNew = async (req, res) => {
  try {
    req.body.createdBy = new mongoose.Types.ObjectId(req.user.userId)
    let locationData = await Promise.resolve(getAddressLocationData(req.body.location))
    req.body.locationData = locationData
    let newListing = new Listing(req.body)
    let savedListing = await newListing.save()
    await User.updateOne(
      { _id: req.user.userId },
      {
        $push: {
          myListings: savedListing._id,
        },
      },
    )
    res
      .status(201)
      .send({
        message: "Listing added successfully",
        listingId: savedListing._id,
        listing: savedListing
      })
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      // Handle validation error
      res.status(400).json({
        error: "ValidationError",
        message: err.message,
        errors: err.errors, // This will provide details of each validation error
      })
    } else if (err instanceof mongoose.Error.CastError) {
      // Handle cast error
      res.status(400).json({
        error: "CastError",
        message: err.message,
        path: err.path, // The path of the field that caused the error
        value: err.value, // The value that caused the cast error
      })
    } else {
      // Handle other types of errors
      res.status(500).json({
        error: "InternalServerError",
        message: err.message,
      })
    }
  }
}

const updateListing = async (req, res) => {
  const id = new mongoose.Types.ObjectId(req.params.id)
  const updateData = req.body
  try {
    // Find the listing by ID and update it
    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure the update adheres to the schema's validators
    })
    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" })
    }
    res.status(200).json({ message: "Listing updated successfully" })
    } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const getListingById = async (req, res) => {
  const listingId = req.params.id;

  try {
    const listing = await Listing.findByIdAndUpdate(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json({ listing });
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteListingById = async (req, res) => {
  const listingId = req.params.id;

  try {
    // Find and delete the listing by ID
    const deletedListing = await Listing.findByIdAndDelete(listingId);
    if (!deletedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Remove the listingId from the user's myListings array
    await User.updateOne(
      { _id: deletedListing.createdBy },
      { $pull: { myListings: listingId } },
    );

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getListings = async (req, res) => {
  let sectionNo = req.params.sectionNo;
  try {
    const batch = parseInt(sectionNo) || 1; // Default to batch 1 if not specified
    const limit = 15; // Default to 20 documents per batch
    const skip = (batch - 1) * limit; // Calculate the number of documents to skip
    const listings = await Listing.find({approved: true}).skip(skip).limit(limit)
    res
      .status(200)
      .json({ listings, listingsArray: listings.map((x) => x._id) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const getUnapprovedListing = async (req,res) => {
  try {
    const listings = await Listing.find({approved: false})
    res
      .status(200)
      .json({ listingsData: listings, listingsArray: listings.map((x) => x._id) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const approveListing = async (req,res)=>{
  let {id} = req.params
    if(req.user.accountType !== 'admin') {
      res.status(401).send({message: 'this is not an admin account'})
      return;
    }
    try {
      await Listing.findByIdAndUpdate(id,{approved: true, approvedBy: req.user.userId})
      res.status(200).send({approved: true, id, approvedBy: req.user.name})
    }
    catch(err){
      res.status(500).json({error: err.message})
    }
}

const searchListings = async (request, response) => {
  const {
    location,
    minPrice,
    maxPrice,
    saleType,
    minMonthlyPayment,
    maxMonthlyPayment,
    bedroom,
    bathroom,
    state,
    developmentStage,
    LGA
  } = request.query;
  
console.log('queries', request.query)
  try {
    let query = {};
    // Add location filter if provided
    if(state){
      query.state = state
    }
    if(LGA){
      query.LGA = LGA
    }
    if(developmentStage){
      query.developmentStage = developmentStage
    }
    if (location) {
      // Split the location string by dashes and create regex patterns for each keyword
      const keywords = location.split("-");
      const locationRegexArray = keywords.map((keyword) => ({
        location: { $regex: keyword, $options: "i" },
      }));
      // Create a $or condition for each regex pattern
      query.$or = locationRegexArray;
    }

    // Add price range filter if provided
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }
    // Sale type filter
    // let saleTypeType = ['rent','sale','shortlet']
    if (saleType == 'rent' || saleType== 'sale') {
      query.saleType = { $regex: saleType, $options: "i" };
    }

    // Monthly payment range filter for rentals
    if (minMonthlyPayment && maxMonthlyPayment) {
      query.monthlyRentPayment = {
        $gte: Number(minMonthlyPayment),
        $lte: Number(maxMonthlyPayment),
      };
    }

    // Bedrooms filter
    if (bedroom && bedroom !== 'any') {
      query.bedrooms = {$gte: Number(bedroom)};
    }

    // Bathrooms filter
    if (bathroom && bathroom !== 'any') {
    query.bathrooms = {$gte: Number(bathroom)};
    }
    console.log({query})
    // Find listings matching the query
    const foundListings = await Listing.find(query)
    response.status(200).json(foundListings);
  } catch (error) {
    response.status(500).json({ message: error.message });
  }
};

const addListingImages = (req, res) => {
  let { id } = req.params;

  saveToCloudinary(req.files)
    .then((result) => {
      //Listing.updateOne({listingId: id},)
      Listing.findById(id).then((res) => {
        let images = res.images;
        images = images.concat(result);
        Listing.findByIdAndUpdate(id, { images })
          .then((res) => console.log(res))
          .catch((err) => {
            console.log(err);
          });
      });
      res
        .status(200)
        .json({ message: "Files uploaded successfully", result, id });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error uploading files", error });
    });
};

module.exports = {
  createNew,
  updateListing,
  getListingById,
  deleteListingById,
  getListings,
  searchListings,
  addListingImages,
  getUnapprovedListing,
  approveListing
};
