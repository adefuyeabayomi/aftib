const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  title: { type: String }, // Hotel name
  description: { type: String },
  address: { type: String }, // Full address // Detailed description of the hotel
  location: {
    city: { type: String }, // City
    state: { type: String }, // State
    country: { type: String }, // Country
    zipCode: { type: String }, // Zip code
    latitude: { type: Number }, // Latitude for geolocation
    longitude: { type: Number }, // Longitude for geolocation
  },
  contact: {
    phone: { type: String }, // Contact phone number
    email: { type: String }, // Contact email
    website: { type: String }, // Website URL
  },
  amenities: [String], // List of amenities (e.g., pool, gym, spa)
  rooms: [
    {
      roomType: { type: String }, // Type of room (e.g., single, double, suite)
      description: { type: String }, // Description of the room
      price: { type: Number }, // Price per night
      amenities: [String], // List of room-specific amenities
      images: [String], // URLs to images of the room
      maxOccupancy: { type: Number }, // Maximum number of occupants
      availability: { type: Boolean, default: true }, // Availability status
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
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
