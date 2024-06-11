const mongoose = require("mongoose");
let runningEnvironment = process.env.NODE_ENV;

let DB = undefined
if(runningEnvironment == "production"){
  let running_db = process.env.PROD_DB
  DB = running_db;
}
else if(runningEnvironment == 'development'){
  let running_db = process.env.DEV_DB
  DB = running_db;
}
else {
  let running_db = "mongodb+srv://adefuyeabayomi:omolewa9@cluster0.ppt7z.mongodb.net/aftibdb?retryWrites=true&w=majority&appName=Cluster0"
  DB = running_db;
}

async function connectDB() {
    try {
      await mongoose.connect(DB);
     } catch (err) {
      process.exit(1);
  }
  return await mongoose.connect(DB);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

module.exports = connectDB;
