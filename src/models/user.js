const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HotelReservationSchema = new Schema({
  reservationId: { type: String, required: true }, // Unique ID for the reservation
  hotelId: { type: String, required: true }, // ID of the hotel being booked
  bookingDate: { type: Date, required: true }, // Date of the booking
  checkInDate: { type: Date, required: true }, // Check-in date
  checkOutDate: { type: Date, required: true }, // Check-out date
  status: { type: String, required: true }, // Status of the reservation
});

// Schema for Hotel Bookings (hotel providers)
const HotelBookingSchema = new Schema({
  bookingId: { type: String, required: true }, // Unique ID for the booking
  clientId: { type: String, required: true }, // ID of the client making the reservation
  bookingDate: { type: Date, required: true }, // Date of the booking
  checkInDate: { type: Date, required: true }, // Check-in date
  checkOutDate: { type: Date, required: true }, // Check-out date
  status: { type: String, required: true }, // Status of the booking
});

const PurchaseSchema = new Schema({
  purchaseId: { type: String, required: true }, // Unique ID for the purchase
  propertyId: { type: String, required: true }, // ID of the property being purchased
  purchaseDate: { type: Date, required: true }, // Date of the purchase
  status: { type: String, required: true }, // Status of the purchase
});

// Schema for Sales (providers/sellers)
const SaleSchema = new Schema({
  saleId: { type: String, required: true }, // Unique ID for the sale
  clientId: { type: String, required: true }, // ID of the client making the purchase
  saleDate: { type: Date, required: true }, // Date of the sale
  status: { type: String, required: true }, // Status of the sale
});

// Schema for Rentals (clients and providers)
const RentalSchema = new Schema({
  rentalId: { type: String, required: true }, // Unique ID for the rental
  propertyId: { type: String, required: true }, // ID of the property being rented
  rentalDate: { type: Date, required: true }, // Date of the rental agreement
  startDate: { type: Date, required: true }, // Start date of the rental period
  endDate: { type: Date, required: true }, // End date of the rental period
  status: { type: String, required: true }, // Status of the rental
});

let userSchema = new mongoose.Schema({
  email: String,
  hash: String,
  signupType: String,
  mobileNumber: String,
  name: String,
  verified: Boolean,
  accountType: String,
  isAgent: Boolean,
  myListings: [String], // ids of the listings
  myHotels: [String], // ids of the hotels
  myTransactions: [
    {
      transactionId: String,
      clientId: String,
      providerId: String,
    },
  ],
  myHotelReservations: [HotelReservationSchema], // Array of hotel reservations for clients
  myHotelBookings: [HotelBookingSchema], // Array of hotel bookings for hotel providers
  myPurchases: [PurchaseSchema], // Array of purchases for clients
  mySales: [SaleSchema], // Array of sales for providers/sellers
  myRentals: [RentalSchema], // Array of rentals for both clients and providers
});

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
