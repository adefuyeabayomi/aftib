const User = require("../models/user");
const Transaction = require("../models/transactions");
const Listing = require("../models/listing");
const Hotel = require("../models/hotel");
const generateId = require("../utils/generateID");
const axios = require('axios')
const crypto = require('crypto'); 

const createTransaction = async (req, res) => {
  let transactionId = generateId(40);
  let {propertyId,hotelId,bookingDetails,rentDetails} = req.body;
  let transactionType = req.body.transactionType;
  let product;
  let providerId;
  let narration;
  let amount;

  try {
    // Fetch the product based on the transaction type
    if (transactionType === "hotelBooking") {
      product = await Hotel.findById(hotelId);
      let room = product.filter(x=> x.roomType == bookingDetails.room.roomType)[0]
      bookingDetails.price = bookingDetails.totalNights * room.price
      amount = bookingDetails.price;
      narration = `Booking for a ${room.type} for ${bookingDetails.totalNights} Nights, Starting from ${bookingDetails.startDate} to ${bookingDetails.endDate}`
    } else {
      product = await Listing.findById(propertyId)
      if(transactionType === "propertyPurchase"){
        narration = `Purchase of ${product.title}`
        amount = product.price
      }
      else {
        narration = `Rent of ${product.title} for ${rentDetails.totalMonths}`
        amount = product.monthlyRentPayment * rentDetails.totalMonths
        rentDetails.price = amount;
      }
    }
    // If product is not found, return 404
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    providerId = product.createdBy;

    let transactionData = {
      ...req.body,
      transactionId,
      clientId: req.user.userId,
      providerId,
      date: Date.now(), // Use Date.now() to get the current timestamp
      paymentStatus: "pending",
      transactionStatus: "pending",
      narration
    }
    // get RRR
    let endpoint = 'https://demo.remita.net/remita/exapp/api/v1/send/api/echannelsvc/merchant/api/paymentinit'
    let rrrData = { 
      serviceTypeId: 4430731,
      amount,
      orderId: transactionId,
      payerName: req.user.name,
      payerEmail: req.user.email,
      payerPhone: req.user.mobileNumber,
      description: transactionData.narration
    }
    let merchantId = process.env.merchantId
    let serviceTypeId = process.env.serviceTypeId
    let orderId = transactionId
    let totalAmount = amount
    let apiKey =  process.env.apiKey
    let concatenatedString = merchantId + serviceTypeId + orderId + totalAmount + apiKey
    // Compute SHA-512 hash
    const hash = crypto.createHash('sha512');
    hash.update(concatenatedString);
    const hashHex = hash.digest('hex');
    try {
          let response = await axios.post(endpoint,JSON.stringify(rrrData),{
                    headers: {
                      'Content-Type': 'application/json', 
                      'Authorization': `remitaConsumerKey=2547916,remitaConsumerToken=${hashHex}`
                  }
                })
          let jsonpResponse = response.data;
          let jsonResponse = JSON.parse(jsonpResponse.replace(/^.*\((.*)\)$/, '$1'));
      transactionData = {...transactionData, RRR: jsonResponse.RRR}
    }
    catch(err){
      console.error(err.message)
      res.status(500).send({message: 'unable to generate RRR'})
      return;
    }
    // server generated props. transactionId, clientId,date,paymentstatus,transaction status, providerId
    // required in the request body. transaction type, propertyId, hotelId, bookingDetails
    // Create a new transaction

    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update the client's transactions
    await User.findByIdAndUpdate(transaction.clientId, {
      $push: {
        myTransactions: {
          transactionId: transaction.transactionId, // Use the MongoDB-generated _id
          clientId: transaction.clientId,
          providerId: transaction.providerId,
        },
      },
    });

    // Update the provider's transactions
    await User.findByIdAndUpdate(transaction.providerId, {
      $push: {
        myTransactions: {
          transactionId: transaction.transactionId, // Use the MongoDB-generated _id
          clientId: transaction.clientId,
          providerId: transaction.providerId,
        },
      },
    })

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

const initializePayment = async (req, res) => {
  const { transactionId } = req.body
  let transaction;
  let product;
  let amount;
  // get the amount and the currency from the transaaction document.
  // first try to findbyid the transaction. if it does not exist, error 404, then proceed to extract the price and currency.
    try {
      transaction = await Transaction.findOne({transactionId})
      let RemitaOneTimeID = generateId(10)

      if(transaction.transactionType === "hotelBooking"){
        product = await Hotel.findById(transaction.propertyId)
        amount = transaction.bookingDetails.price
      }
      else {
        product = await Listing.findById(transaction.propertyId)
        if(transaction.transactionType === "propertyPurchase"){
          amount = product.price
        }
        else {
          amount = transaction.rentDetails.totalMonths * product.monthlyRentPayment          
        }
      }
      let processRRRData = {
        key:process.env.REMITA_PUBLIC_KEY,
        processRrr: true,
        transactionId: RemitaOneTimeID, //you are expected to generate new values for the transactionId for each transaction processing.
        channel: "CARD,USSD", //this field is used to filter what card channels you want enabled on the payment modal
        extendedData: { 
            customFields: [ 
                { 
                    name: "rrr", 
                    value: transaction.RRR //rrr to be processed.
                } 
             ]
        }
      }
      transaction.RemitaOneTimeID = RemitaOneTimeID
      await transaction.save()
      /**
      let transactionData = {
        key: process.env.REMITA_PUBLIC_KEY,
        customerId: req.user.userId,
        firstName: req.user.name.split(' ')[0],
        lastName: req.user.name.split(' ')[1],
        email: req.user.email,
        amount: 50,
        narration: transaction.narration,
        transactionId,
        channel: "CARD,USSD,QR,IBANK",
      }
       */
      res.status(200).send(processRRRData)
    }
    catch (err){
      console.error({err})
      res.status(500).json({error: err.message})
    } 
}

const checkPaymentStatus = async (req, res) => {
  let {transactionId} = req.body;
  let secretKey = '23093b2bda801eece94fc6e8363c05fad90a4ba3e12045005141b0bab41704b3a148904529239afd1c9a3880d51b4018d13fd626b2cef77a6f858fe854834e54'
    // Concatenate transactionId and secretKey
    const concatenatedString = transactionId + secretKey;

    // Compute SHA-512 hash
    const hash = crypto.createHash('sha512');
    hash.update(concatenatedString);
    const hashHex = hash.digest('hex');
  axios.get(`https://demo.remita.net/payment/v1/payment/query/${transactionId}`,{
    headers: {
      'publicKey': 'QzAwMDAyNzEyNTl8MTEwNjE4NjF8OWZjOWYwNmMyZDk3MDRhYWM3YThiOThlNTNjZTE3ZjYxOTY5NDdmZWE1YzU3NDc0ZjE2ZDZjNTg1YWYxNWY3NWM4ZjMzNzZhNjNhZWZlOWQwNmJhNTFkMjIxYTRiMjYzZDkzNGQ3NTUxNDIxYWNlOGY4ZWEyODY3ZjlhNGUwYTY=', 
      'Content-Type': 'application/json', 
      'TXN_HASH': hashHex
    }
  }).then(response=>{
    console.log(response.data)
    res.status(200).json(response.data)
  }).catch(err=>{
    console.log(err)
    res.status(500).send({error: err.message})
  })
};

const checkRRRPaymentStatus = async (req, res) => {
  let { transactionId } = req.body;

  try {
    // Fetch the transaction document by transactionId
    let transaction = await Transaction.findOne({ transactionId });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    let merchantId = process.env.merchantId;
    let apiKey = process.env.apiKey;
    let secretKey = process.env.REMITA_SECRET_KEY;
    let concatenatedString = transaction.RRR + apiKey + merchantId;

    // Compute SHA-512 hash
    const hash = crypto.createHash('sha512');
    hash.update(concatenatedString);
    const hashHex = hash.digest('hex');

    // Check payment status
    let response = await axios.get(
      `https://demo.remita.net/remita/exapp/api/v1/send/api/echannelsvc/${merchantId}/${transaction.RRR}/${hashHex}/status.reg`,
      {
        headers: {
          Authorization: `remitaConsumerKey=${merchantId},remitaConsumerToken=${hashHex}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let responseData = JSON.parse(response.data.replace('jsonp (', '').slice(0, -1));

    if (responseData.message === 'Transaction Pending') {
      return res.status(200).json({ message: 'Transaction is still pending', status: 'pending' });
    } else if (responseData.message === 'Successful') {
      // Update the transaction status to 'Successful'
      transaction.paymentStatus = 'successful';
      transaction.transactionStatus = 'completed';
      await transaction.save();

      // Update the user's data based on the transaction type
      let updateData = { status: 'completed' };
      if (transaction.transactionType === 'hotelBooking') {
        updateData = {
          reservationId: transaction.transactionId,
          hotelId: transaction.hotelId,
          bookingDate: transaction.date,
          checkInDate: transaction.bookingDetails.startDate,
          checkOutDate: transaction.bookingDetails.endDate,
          status: 'completed',
        };

        // Update the client's hotel reservations
        await User.findByIdAndUpdate(transaction.clientId, {
          $push: { myHotelReservations: updateData },
        });

        // Update the provider's hotel bookings
        await User.findByIdAndUpdate(transaction.providerId, {
          $push: { myHotelBookings: { ...updateData, bookingId: transaction.transactionId, clientId: transaction.clientId } },
        });
      } else if (transaction.transactionType === 'propertyPurchase') {
        updateData = {
          purchaseId: transaction.transactionId,
          propertyId: transaction.propertyId,
          purchaseDate: transaction.date,
          status: 'completed',
        };

        // Update the client's purchases
        await User.findByIdAndUpdate(transaction.clientId, {
          $push: { myPurchases: updateData },
        });

        // Update the provider's sales
        await User.findByIdAndUpdate(transaction.providerId, {
          $push: { mySales: { ...updateData, saleId: transaction.transactionId, clientId: transaction.clientId } },
        });
      } else if (transaction.transactionType === 'propertyRental') {
        updateData = {
          rentalId: transaction.transactionId,
          propertyId: transaction.propertyId,
          rentalDate: transaction.date,
          startDate: transaction.rentDetails.startDate,
          endDate: transaction.rentDetails.endDate,
          status: 'completed',
        };

        // Update the client's rentals
        await User.findByIdAndUpdate(transaction.clientId, {
          $push: { myRentals: updateData },
        });

        // Update the provider's rentals
        await User.findByIdAndUpdate(transaction.providerId, {
          $push: { myRentals: { ...updateData, clientId: transaction.clientId } },
        });
      }

      return res.status(200).json({ message: 'Transaction completed successfully', status: 'successful' });
    } else {
      return res.status(400).json({ message: 'Transaction failed', status: 'failed' });
    }
  } catch (error) {
    console.error('Error checking RRR payment status:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


module.exports = {
  createTransaction,
  initializePayment,
  checkPaymentStatus,
  checkRRRPaymentStatus
}
