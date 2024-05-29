//import dependencies
require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/dbConnect");

//import routes
const mockRoute =  require("./routes/mock")
const authRoute = require("./routes/auth")

// define constants
let port = 8080 | process.env.PORT;
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

console.log({ port, runningEnvironment, DB });

//connect to database
connectDB(DB)
  .then(() => console.log("Success : connected to database"))
  .catch((err) => console.error("Error in connecting to database : ", err));

// create express app
const app = express();

// install middlewares
app.use(cors())
app.use(express.json())
app.use("/",mockRoute)
app.use("/auth",authRoute)

// listen
app.listen(port, () => {

  console.log("server running on localhost, port", port);
})

module.exports = app;

