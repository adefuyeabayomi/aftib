const fs = require("fs")
const path = require("path")
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
    })
  })
}

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

async function populateListings (req,res) {
  let data = fs.readFileSync(path.join(__dirname,'magodo.json')).toString()
  data = JSON.parse(data)
  data = data.map(x=>{
    delete x.createdBy
    return x
  })
  try {
    await Listing.insertMany(data)
    res.status(200).send({success: 'populated listings'})
  }
  catch(err){
    console.log({error: err.message})
    res.status(500).send({error: err.message})
  }
}

module.exports = {
  ping,
  getAccessLog,
  clearUsers,
  clearListings,
  populateListings
}
