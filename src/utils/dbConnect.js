const mongoose = require("mongoose");

async function connectDB(DB) {
  return await mongoose.connect(DB);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = connectDB;
