const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
    ref: "User", // Reference to the User model
  },
  providerId: {
    type: String,
    required: true,
    ref: "User", // Reference to the User model
  },
  transactionType: {
    type: String,
    required: true,
    enum: ["propertyPurchase", "propertyRental", "hotelBooking","propertyShortLet"], // Enumerated types for transaction types
  },
  transactionStatus: {
    type: String,
    required: true,
    enum: ["pending", "success", "cancelled"], // Enumerated types for transaction status
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed"], // Enumerated types for payment status
  },
  date: {
    type: Number, // Date timestamp when the transaction was created
  },
  propertyId: {
    type: String,
    ref: "Listing", // Reference to the Property model if applicable
  },
  hotelId: {
    type: String,
    ref: "Hotel", // Reference to the Hotel model if applicable
  },
  bookingDetails: {
    room: Object, // Detailed information about the booked room
    startDate: Date, // Start date of the booking
    endDate: Date, // End date of the booking
    totalNights: Number, // Total number of nights booked
    price: Number, // Total price of the booking
  },
  rentDetails: {
    startDate: Date, // Start date of the rental
    endDate: Date, // End date of the rental
    totalMonths: Number, // Total number of months for the rental
    price: Number, // Total price of the rental
  },
  purchaseDetails: {
    price: Number, // Price of the purchase
  },
  narration: String, // Additional information or notes about the transaction
  RRR: String, // Remita Retrieval Reference (RRR) for payment tracking
  RemitaOneTimeID: String, // Remita One Time ID for payment tracking
});

module.exports = mongoose.model("Transaction", transactionSchema);
