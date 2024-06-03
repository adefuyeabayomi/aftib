const mongoose = require('mongoose')

let listingObj = {
    // Existing Properties
    description: String,      // Detailed description of the property
    propertyType: String,     // Type of property (e.g., apartment, house, condo)
    location: String,         // General location or address
    estate: String,           // Name of the estate, if applicable
    price: Number,            // Price of the property
    state: String,            // State where the property is located
    LGA: String,              // Local Government Area
    saleType: String,         // Type of sale (e.g., for sale, for rent)

    // Additional Properties
    title: String,            // Title of the listing
    bedrooms: Number,         // Number of bedrooms
    bathrooms: Number,        // Number of bathrooms
    size: Number,             // Size of the property in square feet or meters
    yearBuilt: Number,        // Year the property was built
    amenities: [String],      // List of amenities (e.g., pool, gym, parking)
    images: [String],         // URLs to images of the property
    contact: {                // Contact details for the listing
        name: String,
        phone: String,
        email: String
    },
    availableFrom: Number,      // Date when the property is available [new Date.getTime()]
    listingDate: Number,        // Date when the listing was created [new Date.getTime()]
    furnished: Boolean,       // Indicates if the property is furnished
    petsAllowed: Boolean,     // Indicates if pets are allowed
    energyRating: String,     // Energy efficiency rating
    nearbySchools: [String],  // List of nearby schools
    transportation: String,   // Information about nearby public transportation
    garage: Boolean,          // Indicates if there is a garage
    garden: Boolean,          // Indicates if there is a garden
    balcony: Boolean,         // Indicates if there is a balcony
    floorNumber: Number,      // The floor number if it's an apartment
    propertyStatus: String,   // Current status (e.g., available, under contract, sold)
    neighborhood: String,     // Additional details about the neighborhood
    virtualTour: String,      // URL to a virtual tour of the property
    createdBy: String,        // userId that created the listing
    listingId: String,
    sid: String
}
const listingSchema = mongoose.Schema(listingObj)
const listingModel = mongoose.model("Listing",listingSchema)


// model section data

let sectionDataObj= {
    name: 'main', // main or Section1, section2... 
    totalListings: Number, // total number of listings
    totalSections: Number, // total number of sections
    listings: [String], // listings in a section
    count: Number, // listings count in a section
    active: Number, // listings currently active in a section
    inactive: [String] // listings currently inactive in a section
}

let sectionDataSchema = mongoose.Schema(sectionDataObj)
let sectionDataModel = mongoose.model("SectionData",sectionDataSchema)

module.exports = {listingModel,sectionDataModel}



/*
    description: a description of the property,
    propertyType: Bungalow, 2 bedroom,,
    location: Area where the property is located,
    estate: true,
    price: 8980490,
    state: Osun State,
    LGA: Ogbomosho,
    saleType: Rent or Sale,
    imagesLinks: []
    ...... other informations
*/



