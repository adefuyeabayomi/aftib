const Hotel = require("../models/hotel");
const User = require("../models/user");
const mongoose = require("mongoose");
let AgentModel = require('../models/agentStatusRequest')
const saveToCloudinary = require("../functions/saveToCloudinary");
const getAddressLocationData = require('../functions/getAddressLocationData')
const addNewHotel = async (req, res) => {
  try {
    // Extract hotel details from the request body
    
    let Agent = await AgentModel.findOne({agentId: req.user.userId})
    let {name,businessName,phone,whatsappNo,email,officeAddress,state,LGA,agencyType} = Agent
    req.body.agentData = {name,businessName,phone,whatsappNo,email,officeAddress,state,LGA,agencyType}
    req.body.createdBy = new mongoose.Types.ObjectId(req.user.userId)
    let locationData = await Promise.resolve(getAddressLocationData(req.body.address))
    req.body.locationData.googleData = locationData
    req.body.createdDate = new Date().getTime()
    req.body.approvalState = 'pending'
    const hotelData = req.body;
    console.log({body: req.body})

    // Create a new hotel document
    const newHotel = new Hotel(hotelData);
    await newHotel.save();

    // Update the user's myHotels array with the new hotel's ID
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { myHotels: newHotel._id },
    });

    // Send a success response
    res.status(201).json({
      message: "Hotel added successfully",
      hotel: newHotel,
    });
  } catch (error) {
    console.error("Error adding hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllHotels = async (req, res) => {
  const batchSize = 20; // Number of hotels to retrieve per batch
  let batch = req.params.sectionNo || 1; // Default to first batch if not specified

  try {
    const count = await Hotel.countDocuments(); // Get total number of hotels

    const hotels = await Hotel.find({approved: true})
      .skip((batch - 1) * batchSize) // Skip hotels in previous batches
      .limit(batchSize); // Limit number of hotels per batch

    res.status(200).json({
      hotels,
      currentPage: batch,
      totalPages: Math.ceil(count / batchSize),
    });
  } catch (error) {
    console.error("Error fetching hotels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateHotelById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const updateData = req.body;
  updateData.approvalState = 'pending'

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if the user is the creator
    if (String(hotel.createdBy) !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(hotel, updateData);
    await hotel.save();

    res.status(200).json({ message: "Hotel updated successfully", hotel });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const deleteHotelById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if the user is the creator
    if (String(hotel.createdBy) !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Hotel.findByIdAndDelete(id);
    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const saveHotelImages = async (req, res) => {
  const { id } = req.params; // MongoDB generated _id
  const userId = req.user.userId; // Assuming userId is available in req.user
  console.log({ id, userId });
  try {
    // Check if the hotel exists
    const hotel = await Hotel.findById(id);

    console.log({ hotel });

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if the user is the author of the hotel
    if (hotel.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: You are not authorized to update this hotel",
        });
    }

    // Save images to cloudinary
    const result = await saveToCloudinary(req.files);

    // Append the new images to the existing ones
    let images = hotel.images.concat(result);

    // Update the hotel with the new images
    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      { images },
      { new: true }, // Option to return the updated document
    );

    res
      .status(200)
      .json({ message: "Files uploaded successfully", updatedHotel });
  } catch (error) {
    console.error("Error saving hotel images:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


const updateRoomImages = async (req, res) => {
  const { hotelId, roomId } = req.params; // MongoDB generated _id for hotel and room
  const userId = req.user.userId; // Assuming userId is available in req.user
  try {
    // Check if the hotel exists
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Check if the user is the author of the hotel
    if (hotel.createdBy.toString() !== userId) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: You are not authorized to update this hotel",
        });
    }
    let mongoId = '';
    hotel.rooms.forEach(x=>{
      let id = x._id
      if(roomId === x.roomId){
        mongoId = id
      }
    })
    // Find the room within the hotel's rooms array
    const room = hotel.rooms.id(mongoId);
    console.log({MongoId: mongoId})
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Save images to cloudinary
    const result = await saveToCloudinary(req.files);

    // Append the new images to the existing ones
    room.images = room.images.concat(result);
    console.log({hotel})

    // Save the updated hotel document
    await hotel.save();

    res
      .status(200)
      .json({ message: "Room images updated successfully", hotel });
  } catch (error) {
    console.error("Error updating room images:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const approveHotelById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    if(req.user.accountType !== 'admin'){
      return res.status(401).send({error: 'Only admins can approve.'})
    }

    hotel.approved = true;
    hotel.approvedBy = userId;
    await hotel.save();

    res.status(200).json({ message: "Hotel approved successfully", hotel });
  } catch (error) {
    console.error("Error approving hotel:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

const rejectHotel = async (req,res)=>{
  let {id} = req.params
  let {message} = req.query
    if(req.user.accountType !== 'admin') {
      res.status(401).send({message: 'this is not an admin account'})
      return;
    }
    try {
      await Hotel.findByIdAndUpdate(id,{approved: false, approvedBy: req.user.userId,approvalState: 'rejected', rejectionMessage: message })
      res.status(200).send({rejected: true})
    }
    catch(err){
      res.status(500).json({error: err.message})
    }
}

const getUnapprovedHotels = async (req, res) => {
  const batchSize = 20;
  let batch = req.params.page || 1;

  try {
    const count = await Hotel.countDocuments({ approved: false });
    const hotels = await Hotel.find({ approved: false })
      .skip((batch - 1) * batchSize)
      .limit(batchSize);

    res.status(200).json({
      hotels,
      currentPage: batch,
      totalPages: Math.ceil(count / batchSize),
    });
  } catch (error) {
    console.error("Error fetching unapproved hotels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addNewHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  saveHotelImages,
  updateRoomImages,
  getUnapprovedHotels,
  approveHotelById,
  rejectHotel
};
