const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  name: { type: String }, // Hotel name
  description: { type: String },
  address: { type: String }, // Full address // Detailed description of the hotel
  locationData: {
    LGA: { type: String }, // City
    state: { type: String }, // State
    latitude: { type: Number }, // Latitude for geolocation
    longitude: { type: Number },
    googleData: Object // Longitude for geolocation
  },
  contact: {
    phone: { type: String }, // Contact phone number
    email: { type: String }, // Contact email
    website: { type: String }, // Website URL
  },  
  approved: {
    type: Boolean,
    default: false
  }, // Shows that admin has approved the property
  approvedBy: String, // the mongo id of the admin account that approved the listing.
  amenities: {
    spa: Boolean,
    pool: Boolean,
    gym: Boolean,
    freeWifi: Boolean,
    restaurant: Boolean,
    bar: Boolean,
    airConditioning: Boolean,
    parking: Boolean,
    FrontDesk: Boolean,
    roomService: Boolean,
    laundryService: Boolean,
    shuttleService: Boolean,
    petFriendly: Boolean,
    nonSmokingRooms: Boolean,
    businessCenter: Boolean,
    meetingRooms: Boolean,
    familyRooms: Boolean,
    accessibleRooms: Boolean,
    breakfastIncluded: Boolean,
    conciergeService: Boolean,
    luggageStorage: Boolean,
    freeToiletries: Boolean,
    hairDryer: Boolean,
    tv: Boolean,
    minibar: Boolean,
    safe: Boolean,
    balcony: Boolean,
    coffeeMaker: Boolean,
    ironAndIroningBoard: Boolean,
    telephone: Boolean,
    heating: Boolean
  }, // List of amenities (e.g., pool, gym, spa)
  rooms: [ 
    {
      roomType: { type: String }, // Type of room (e.g., single, double, suite)
      description: { type: String }, // Description of the room
      price: { type: Number }, // Price per night
      amenities: [String], // List of room-specific amenities
      images: {type:[String],default : []}, // URLs to images of the room
      maxOccupants: { type: Number }, // Maximum number of occupants
      availability: { type: Boolean, default: true }, // Availability status
      roomCount: {type: Number, default: 1},
      availability: { type: Boolean, default: true }, // Availability status
      roomId: String
    },
  ],
  images: [String], // URLs to images of the hotel
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who gave the rating: userId
      rating: { type: Number, min: 1, max: 5 }, // Rating value
      comment: { type: String }, // Comment from the user
    },
  ],
  averageRating: { type: Number, default: 0 }, // Average rating of the hotel
  policies: {
    checkIn: { type: String }, // Check-in time
    checkOut: { type: String }, // Check-out time
    cancellation: { type: String }, // Cancellation policy
  },
  nearbyAttractions: [String], // List of nearby attractions
  createdDate: { type: Number }, // Date when the hotel was added Date.getTime()
  updatedDate: { type: Number }, // Date when the hotel details were last updated
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // userId that created the listing
  approvalState: String, //'pending'  'approved', 'rejected'
  rejectionMessage: String,
  agentData: Object
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
