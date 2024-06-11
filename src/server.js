//import dependencies
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./utils/dbConnect")
const {sectionDataModel} = require("./models/listing")
const verifyToken = require("./functions/verifyToken.middleware")

//import routes
const ping =  require("./routes/ping")
const authRoute = require("./routes/auth")
const {readListing,writeListing} = require("./routes/listing")

// define constants
let port = 8080 | process.env.PORT;

//connect to database
connectDB()
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

// middlewares install 
app.use(cors())
app.use(express.json())
app.use("/",ping)
app.use("/auth",authRoute)
app.use("/listing",readListing)
app.use(verifyToken)
app.use("/listing",writeListing)

// listen
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
})

module.exports = app;

