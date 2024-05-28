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
let DB =
  runningEnvironment == "production" ? process.env.PROD_DB : process.env.DEV_DB || "mongodb://localhost:27017/test"

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

