const mongoose = require("mongoose")
const Schema = mongoose.Schema

const transactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
    ref: "User",
  },
  providerId: {
    type: String,
    required: true,
    ref: "User",
  },
  transactionType: {
    type: String,
    required: true,
    enum: ["propertyPurchase", "propertySale", "hotelBooking"], // Add more types as needed
  },
  transactionStatus: {
    type: String,
    required: true,
    enum: ["pending", "success", "cancelled"],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed"], // Example payment statuses, adjust as needed
  },
  date: {
    type: Number,
  },
  propertyId: {
    type: String,
    ref: "Property", // Assuming there is a Property model
  }
})

const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction;
