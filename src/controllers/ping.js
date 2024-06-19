const fs = require("fs");
const path = require("path");
const User = require('../models/user')
const Listing = require('../models/listing')
const ping = (req, res) => {
  res.status(200).send("awake");
};

const getAccessLog = (req, res) => {
  const logFilePath = path.join(__dirname, "../access.log");

  fs.stat(logFilePath, (err, stats) => {
    if (err) {
      return res.status(404).send("Log file not found")
    }

    res.sendFile(logFilePath, (err) => {
      if (err) {
        res.status(500).send("Error reading log file");
      }
    });
  });
};

const clearUsers = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users have been deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing users', error: error.message });
  }
}

const clearListings = async (req, res) => {
  try {
    await Listing.deleteMany({});
    res.status(200).json({ message: 'All listings have been deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing users', error: error.message });
  }
}

module.exports = {
  ping,
  getAccessLog,
  clearUsers,
  clearListings
}
