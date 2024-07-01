const mongoose = require("mongoose");
const defaultUserId = '60d0fe4f5311236168a109ca';
let listingObj = {
  // Existing Properties
  title: String, // Title of the listing
  description: String, // Detailed description of the property
  propertyType: String, // Type of property (e.g., apartment, house, condo)
  location: String, // General location or address
  estate: String, // Name of the estate, if applicable
  price: Number, // Price of the property
  monthlyRentPayment: Number, // Amount to be paid if it is a rental on a monthly basis
  monthlyShortLetPrice: Number, // Amount to be for shortlets on a monthly basis 
  state: String, // State where the property is located
  LGA: String, // Local Government Area
  saleType: String, // Type of sale (e.g., sale, rent, shortlet)
  locationData: Object, // generated from google apis.
  approved: {
    type: Boolean,
    default: false
  }, // Shows that admin has approved the property
  approvedBy: String, // the mongo id of the admin account that approved the listing.
  developmentStage: String,// urban,rural,developing
  // Additional Properties
  bedrooms: Number, // Number of bedrooms
  bathrooms: Number, // Number of bathrooms
  size: Number, // Size of the property in square feet or meters
  yearBuilt: Number, // Year the property was built
  amenities: [String], // List of amenities (e.g., pool, gym, parking)
  images: [String], // URLs to images of the property. Updated when images are saved to the listing
  ownersContact: {
    // Owners Contact Details if created by non-agent
    name: String,
    phone: String,
    email: String,
  },
  availableFrom: Number, // Date when the property is available [new Date.getTime()]
  listingDate: Number, // Date when the listing was created [new Date.getTime()]
  furnished: Boolean, // Indicates if the property is furnished
  petsAllowed: Boolean, // Indicates if pets are allowed
  nearbySchools: [String], // List of nearby schools
  transportation: String, // Information about nearby public transportation
  garage: Boolean, // Indicates if there is a garage
  garden: Boolean, // Indicates if there is a garden
  balcony: Boolean, // Indicates if there is a balcony
  floorNumber: Number, // The floor number if it's an apartment
  propertyStatus: String, // Current status (e.g., available, under contract, sold)
  neighborhood: String, // Additional details about the neighborhood
  virtualTour: String, // URL to a virtual tour of the property
  agentContact: {
    // Agent Details if created from agent account.
    name: String,
    phone: String,
    email: String,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
    default: new mongoose.Types.ObjectId(defaultUserId)
  }, // userId that created the listing
  approvalState: String, //'pending'  'approved', 'rejected'
  rejectionMessage: String,
  agentData: Object
};
const listingSchema = mongoose.Schema(listingObj)
const listingModel = mongoose.model("Listing", listingSchema)

module.exports = listingModel;
