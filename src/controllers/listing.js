let generateID = require('../utils/generateID')
let { listingModel,sectionDataModel } = require('../models/listing')
let Listing = listingModel;
const mongoose = require('mongoose')
// [NOTE: FUNCTION TO SAVE IMAGE SHOULD BE ADDED]
const createNew = async (request,response) =>{
    const {
        description,
        propertyType,
        location,
        estate,
        price,
        state,
        LGA,
        saleType,
        title,
        bedrooms,
        bathrooms,
        size,
        yearBuilt,
        amenities,
        images,
        contact,
        availableFrom,
        listingDate,
        furnished,
        petsAllowed,
        energyRating,
        nearbySchools,
        transportation,
        garage,
        garden,
        balcony,
        floorNumber,
        propertyStatus,
        neighborhood,
        virtualTour,
        createdBy
    } = request.body;

    // save to the database.
    let listingId = generateID(30)
        // determine last section available
        let sectionData = await sectionDataModel.findOne({name: 'main'})
        let {totalSections, count} = sectionData
        if(totalSections === 0 || count === 30){
        // Initialize new section
        console.log("in the new section creation")
            totalSections = totalSections + 1
            await new sectionDataModel({
                name: `section${totalSections}`,
                listings: [],
                active: 0,
                inactive: []
            }).save()
            .then(res=>{
                console.log({'saved new section' : res})
            })
            .catch(err=>{
                console.error({error: err.message})
            })
            // reset count to zero
            await sectionDataModel.updateOne({name: 'main'}, {count: 0, totalSections})
        }

        let newListing = new Listing({
            description,
            propertyType,
            location,
            estate,
            price,
            state,
            LGA,
            saleType,
            title,
            bedrooms,
            bathrooms,
            size,
            yearBuilt,
            amenities,
            images,
            contact,
            availableFrom,
            listingDate,
            furnished,
            petsAllowed,
            energyRating,
            nearbySchools,
            transportation,
            garage,
            garden,
            balcony,
            floorNumber,
            propertyStatus,
            neighborhood,
            virtualTour,
            createdBy,
            listingId,
            sid: String(totalSections)
        })
        // you can now update the new section object.
        await newListing.save()
        .then(res=>{
            console.log('new listing added',res._id)
            sectionDataModel.updateOne({name: 'main'},{$inc: {totalListings: 1,count: 1}}).then(res=>{console.log("updated main")})
            sectionDataModel.updateOne({name: `section${totalSections}`},{ $inc: { active: 1 },$push: { listings: listingId }}).then(res=>{console.log("updated section")})
        })
        .then(res=>{
            response.status(201).send({message: "created: listing added successfully"})
        })
        .catch(err=>{
            if (err instanceof mongoose.Error.ValidationError) {
                // Handle validation error
                response.status(400).json({
                    error: 'ValidationError',
                    message: err.message,
                    errors: err.errors // This will provide details of each validation error
                });
            } else if (err instanceof mongoose.Error.CastError) {
                // Handle cast error
                response.status(400).json({
                    error: 'CastError',
                    message: err.message,
                    path: err.path, // The path of the field that caused the error
                    value: err.value // The value that caused the cast error
                });
            } else {
                // Handle other types of errors
                response.status(500).json({
                    error: 'InternalServerError',
                    message: err.message
                });
            }
        })
}

const updateListing = async (req,res) => {
    const listingId = req.params.id;
    const updateData = req.body;
    try {
        // Find the listing by ID and update it
        const updatedListing = await Listing.updateOne({listingId}, updateData, {
            new: true, // Return the updated document
            runValidators: true // Ensure the update adheres to the schema's validators
        })

        if (!updatedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json(updatedListing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const getListingById = async (req, res) => {
    const listingId = req.params.id;

    try {
        const listing = await Listing.findOne({listingId});

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }
        res.status(200).json(listing);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        res.status(500).json({ message: error.message });
    }
}

const deleteListingById = async (req, res) => {
    const listingId = req.params.id;
    // i still need to update the section data
    try {
        // Find and delete the listing by ID
        const deletedListing = await Listing.findOneAndDelete({listingId})

        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getListings = async (request,response) => {
    let sectionNo = request.params.sectionNo;
    try {
        let sectionData = await sectionDataModel.findOne({name: `section${sectionNo}`})
        let sectionListingIds = sectionData.listings
        // Find listings by IDs
        const foundListings = await listingModel.find({ listingId: { $in: sectionListingIds } });
        
        response.status(200).json({ listingsArray: sectionListingIds, listings: foundListings });
    }
    catch(error){
        response.status(500).json({ message: error.message });
    }
}

const searchListings = async (request,response) => {
    const { location, priceRange } = request.query;

    try {
        let query = {};
       // Add location filter if provided
       if (location) {
        // Split the location string by dashes and create regex patterns for each keyword
        const keywords = location.split('-');
        console.log({keywords})
        const locationRegexArray = keywords.map(keyword => ({ location: { $regex: keyword, $options: 'i' } }));

        // Create a $or condition for each regex pattern
        query.$or = locationRegexArray;
    }

        // Add price range filter if provided
        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            query.price = { $gte: minPrice, $lte: maxPrice };
        }

        // Find listings matching the query
        const foundListings = await Listing.find(query);

        response.status(200).json(foundListings);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

module.exports = {
    createNew, updateListing,getListingById, deleteListingById,getListings, searchListings
}


