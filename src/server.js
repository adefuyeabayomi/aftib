//import dependencies
require("dotenv").config(); 
const express = require("express");
const cors = require("cors");
const connectDB = require("./utils/dbConnect");
const {sectionDataModel} = require("./models/listing")
const verifyToken = require("./utils/verifyToken")

//import routes
const mockRoute =  require("./routes/mock")
const authRoute = require("./routes/auth")
const listingRoute = require("./routes/listing")

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


//connect to database
connectDB(DB)
  .then(async () =>{
    console.log("Success : connected to database")
    let sectionData = await sectionDataModel.findOne({name: 'main'})
    console.log('section data has initialized', !!sectionData)
    if(!sectionData){
      new sectionDataModel({
        name: 'main',
        totalListing: 0,
        totalSections: 0,
        count: 0
      }).save().then(()=>{
        console.log("main section initialized")
      }).catch(err=>{
        console.error({error: err.message})
      })
    }
  })
  .catch((err) => console.error("Error in connecting to database : ", err))

// create express app
const app = express();

// install middlewares
app.use(cors())
app.use(express.json())
app.use("/",mockRoute)
app.use("/auth",authRoute)
app.use(verifyToken)
app.use("/listing",listingRoute)

// listen
app.listen(port, () => {

  console.log("server running on localhost, port", port);
})

module.exports = app;

