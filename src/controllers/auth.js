const User = require("../models/user");
const Hotel = require('../models/hotel')
const Listing = require('../models/listing')
const mongoose = require('mongoose')
const otpModel = require('../models/otp')
const jwt = require("jsonwebtoken");
let AgentModel = require('../models/agentStatusRequest')
let Transaction = require('../models/transactions')
const bcrypt = require("bcryptjs");
const validateEmail = require("../utils/validate");
const generateId = require('../utils/generateID')
// Controller function for processing an order
const { transporter, mailOptions } = require("../utils/nodemailer.config");
const { htmlBodyTemplates } = require("../utils/sendMail");
let adminEmails = process.env.ADMIN_EMAILS

const signup = async (req, res) => {
  let { email, password, mobileNumber, name, signupType, accountType } =
    req.body;
  email = email.toLowerCase();

  // Validate email and password
  if (!validateEmail(email)) {
    return res.status(400).send({
      error: "Email is not valid",
      status: 400,
      message: "Bad Request",
    })
  }
  
  if(accountType == 'admin' && !adminEmails.split(',').includes(email)){
    return res.status(401).json({
      message: "this signup is restricted to admin designated emails"
    })
  }

  // Check if user with that email already exists
  let userExists = await User.find({ email });
  if (userExists.length > 0) {
    return res.status(409).send({
      status: 409,
      message: "Conflict",
      error: "User with this email already exists! Login instead.",
    });
  }

  // Create user
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  let UserDoc = new User({
    email,
    hash,
    signupType,
    mobileNumber,
    name,
    verified: false,
    accountType,
  });

  try {
    // Save user
    let savedUser = await UserDoc.save();

    // Save success: generate and send JWT
    let userForToken = {
      email,
      userId: savedUser._id,
      accountType,
      name,
      mobileNumber,
    };

    let token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 48,
    });

    res.status(201).send({ token, user: userForToken });

    // Send email
    mailOptions.html = htmlBodyTemplates.verifyTemplate(savedUser._id);
    mailOptions.to = email;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Message sent:", info.messageId);
    });
  } catch (err) {
    // Save error: send error message
    res.status(500).send({ error: err.message });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  const passwordCorrect =
    user === null ? false : bcrypt.compare(password, user.hash);
  if (!user) {
    return res.status(404).json({
      error: "Email has not been Registered.",
    });
  }
  if (!passwordCorrect) {
    return res.status(401).json({
      error: "Password does not match.",
    });
  }

  const userForToken = {
    email: user.email,
    userId: user._id,
    accountType: user.accountType,
    name: user.name,
    mobileNumber: user.mobileNumber,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  return res.status(200).send({ token, user: userForToken , expiresIn: 60 * 60 * 48});
};

const verifyEmail = async (req, res) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { verified: true })
    .then((result) => {
      return res.status(200).redirect("http://localhost:3000");
    })
    .catch((err) => {
      return res.status(400).json({
        error: err.message,
      });
    })
}

const getUser = async (req,res) => {
  try {
    let user = await User.findById(req.user.userId)
    delete user.hash
    res.status(200).json(user)
  }
  catch(err){
    console.error(err.message)
    res.status(500).json({error: err.message})
  }
}

const updateUser = async (req, res) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Update the user with the new data from req.body
    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });
    if(req.body.password !== ""){
        // Create user
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.user.password, salt);
      user.password = hash
    }

    // Save the updated user
    await user.save();

    // Send the updated user back as a response
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};


const sendOTPForgotPassword = async (req,res) => {
  let {email} = req.params
  let otp = generateId(4);
  try {
    let user = await User.findOne({email})
    if(!user){
      res.status(404).json({error: 'user not found'})
      return;
    }
    let userOtp = await otpModel.findOne({user: user._id})
    if(userOtp){
      userOtp.otp = otp;
      await userOtp.save()
    }
    else {
      let otpDoc = new otpModel({
        otp,
        user: user._id
      })
      let saved = otpDoc.save()
    }
    mailOptions.html = htmlBodyTemplates.otpForgotPassword(otp)
    mailOptions.to = email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Message sent:", info.messageId);
    });
    res.status(200).json({success: 'email sent'})
  }
  catch(err){
    console.error(err.message)
    res.status(500).json({error: err.message})
  }
}

const verifyOtp = async (req,res) => {
  let {email,otp} = req.params
  try {
    let user = await User.findOne({email})
    if(!user){
      res.status(404).json({error: 'user not found'})
      return
    }
    let retrieved = await otpModel.findOne({user: user._id})
    if(!otp){
      res.status(404).json({error: 'otp not found. click the resend verification'})
      return
    }
    let bool = retrieved.otp === otp
    if(bool){
      res.status(200).json({success: 'otp verified'})
    }
    else {
      res.status(401).json({error: 'Invalid OTP'})
    }   
  }
  catch(err){
    console.error(err.message)
    res.status(500).json({error: err.message})
  }
}

const changePasswordByEmail = async (req, res) => {
  const { email } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    user.hash = hashedPassword;
    await user.save();
    res.status(200).json({ success: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getAgentDashboardData = async (req,res)=>{
  // getHotels,getListings
  try {
    let user = await User.findById(req.user.userId)
    delete user.hash
    let listings = await Listing.find({
      _id: { $in: user.myListings.map(x=> new mongoose.Types.ObjectId(x)) }
    }).lean()
    const hotels = await Hotel.find({
      _id: { $in: user.myHotels.map(x=> new mongoose.Types.ObjectId(x)) }
    }).lean()
    res.status(200).json({listings,hotels})
  }
  catch(err){
    console.error(err.message)
    res.status(500).json({error: err.message})
  }
}

const getAdminDashboardData = async (req,res)=>{
  // hotels
  // listings
  // agents
  // client accounts
  // transactions

  try {
    let user = await User.findById(req.user.userId)
    delete user.hash
    let listings = await Listing.find({});
    let hotels = await Hotel.find({});
    let users = await User.find({accountType : 'client'})
    let transactions = await Transaction.find({})
    let agents = await AgentModel.find({})

    res.status(200).json({listings,hotels,users,transactions,agents})
  }
  catch(err){
    console.error(err.message)
    res.status(500).json({error: err.message})
  }
}

const getUserById = async (req, res) => {
  try {
    // Check if the requesting user is an admin
    if (req.user.accountType !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admins only.' });
    }

    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    // If the user is not found, return a 404 status code
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user details
    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

const getClientCount = async (req, res) => {
  try {
    const clientCount = await User.countDocuments({ accountType: 'client' });
    res.status(200).json({ count: clientCount });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

const getClientAccounts = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const users = await User.find({ accountType: 'client' })
      .skip(skip)
      .limit(limit);

    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  signup,
  login,
  verifyEmail,
  getUser,
  sendOTPForgotPassword,
  verifyOtp,
  changePasswordByEmail,
  getAgentDashboardData,
  getAdminDashboardData,
  updateUser,
  getUserById,
  getClientCount,
  getClientAccounts
};
