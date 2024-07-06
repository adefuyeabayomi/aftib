const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const successfulTransaction = new Schema({
      transactionId: {type: String, required: true},
      details: {type: Object, required: true},
      status: {type: String, required: true},
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
      title: String,
      transactionType: String,
      status: {
        type: String,
        enum: ['pending','success']
      }
    },
  ],
  myHotelReservations: [successfulTransaction], // Array of hotel reservations for clients
  myHotelBookings: [successfulTransaction], // Array of hotel bookings for hotel providers
  myShortLets: [successfulTransaction],
  myPurchases: [successfulTransaction], // Array of purchases for clients
  mySales: [successfulTransaction], // Array of sales for providers/sellers
  myRentals: [successfulTransaction], // Array of rentals for both clients and providers
  gender: String,
  dateOfBirth: Date,
  address: String,
  country: String,
  state: String,
  language: String,
  agentSpecialities: [String],
  agentLicense: String,
  licenseNumber: String,
  licenseExpDate: Date,
  facebook: String,
  instagram: String,
  twitter: String,

});

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;





