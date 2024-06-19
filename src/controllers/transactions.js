const User = require("../models/user");
const Transaction = require("../models/Transaction");
const Listing = require("../models/Transaction");
const Hotel = require("../models/Transaction");
const generateId = require("../utils/generateID");
const axios = require('axios')

const createTransaction = async (req, res) => {
  let transactionId = generateId(40);
  let propertyId = req.body.propertyId;
  let transactionType = req.body.transactionType;
  let product;
  let providerId;

  try {
    // Fetch the product based on the transaction type
    if (transactionType === "hotelBooking") {
      product = await Hotel.findById(propertyId);
      let room = product.filter(x=> x.roomType == bookingDetails.room.roomType)
      req.body.bookingDetails.price = bookingDetails.totalNights * room.price
    } else {
      product = await Listing.findById(propertyId);
    }

    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    providerId = product.createdBy;

    const transactionData = {
      ...req.body,
      transactionId,
      clientId: req.user.userId,
      providerId,
      date: Date.now(), // Use Date.now() to get the current timestamp
      paymentStatus: "pending",
      transactionStatus: "pending",
    }

    // Create a new transaction
    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update the client's transactions
    await User.findByIdAndUpdate(transaction.clientId, {
      $push: {
        myTransactions: {
          transactionId: transaction._id, // Use the MongoDB-generated _id
          clientId: transaction.clientId,
          providerId: transaction.providerId,
        },
      },
    });

    // Update the provider's transactions
    await User.findByIdAndUpdate(transaction.providerId, {
      $push: {
        myTransactions: {
          transactionId: transaction._id, // Use the MongoDB-generated _id
          clientId: transaction.clientId,
          providerId: transaction.providerId,
        },
      },
    });

    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

const secureTransactionData = async (req, res) => {
  const { transactionId } = req.body
  let transaction;
  let product;
  // get the amount and the currency from the transaaction document.
  // first try to findbyid the transaction. if it does not exist, error 404, then proceed to extract the price and currency.
    try {
      transaction = await Transaction.findById(transactionId)
      if(transaction.transactionType === "propertyPurchase"){
        product = await Hotel.findById(transaction.propertyId)
      }
      else {
        product = await Listing.findById(transaction.propertyId)
      }
      let transactionData = {
        key: process.env.REMITA_PUBLIC_KEY,
        customerId: req.user.userId,
        firstName: req.user.name.split(' ')[0],
        lastName: req.user.name.split(' ')[1],
        email: req.user.email,
        amount: product.price || product.monthlyRentPayment || transaction.bookingDetails.price,
        narration: transaction.narration,
        transactionId,
        channel: "CARD,USSD,QR,IBANK",
      }
      res.status(200).send(transactionData)
    }
    catch (err){

    } 
  let amount;
    let currency;

    return {
      key: publicKey,
      customerId: form.querySelector('input[name="email"]').value,
      firstName: form.querySelector('input[name="firstName"]').value,
      lastName: form.querySelector('input[name="lastName"]').value,
      email: form.querySelector('input[name="email"]').value,
      amount: form.querySelector('input[name="amount"]').value,
      narration: form.querySelector('input[name="narration"]').value,
      transactionId: Math.random(),
      channel: "CARD,USSD,QR,IBANK",
    }

};

const updatePaymentStatus = async (transactionId, newStatus) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transactionId },
      { $set: { paymentStatus: newStatus } },
      { new: true },
    )

    if (!updatedTransaction) {
      throw new Error("Transaction not found");
    }

    console.log("Payment status updated successfully");
    return updatedTransaction;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw error; // Propagate the error back to the caller if needed
  }
};

// Example usage
//updatePaymentStatus('txn123', 'paid');

const updateTransactionStatus = async (transactionId, newStatus) => {
  try {
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { transactionId },
      { $set: { transactionStatus: newStatus } },
      { new: true },
    );

    if (!updatedTransaction) {
      throw new Error("Transaction not found");
    }

    console.log("Transaction status updated successfully");
    return updatedTransaction;
  } catch (error) {
    console.error("Error updating transaction status:", error);
    throw error; // Propagate the error back to the caller if needed
  }
};

// Example usage
//updateTransactionStatus('txn123', 'finished - success');
