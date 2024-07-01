//import dependencies
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const connectDB = require("./utils/dbConnect");

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" },
);

//import routes
const ping = require("./routes/ping")
const authRoute = require("./routes/auth")
const listingRoute = require("./routes/listing")
const hotelRoute = require("./routes/hotels")
const transactionRoute = require("./routes/transactions")
const accountOpsRoute = require("./routes/accountOps")
const adminOpsRoute = require('./routes/adminOps')

// define constants
let port = 8080 | process.env.PORT;

//connect to database
connectDB()
  .then(async () => {
    console.log("Success : connected to database");
  })
  .catch((err) => console.error("Error in connecting to database : ", err));

// create express app
const app = express();

// middlewares install
app.use(cors());
// Optionally, specify more detailed CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // specify the frontend URL here
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
// Route to get the access log file
// Setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
app.use("/", ping);
app.use("/auth", authRoute);
app.use("/listing", listingRoute);
app.use("/transactions",transactionRoute)
app.use("/", hotelRoute);
app.use('/',accountOpsRoute);
app.use('/',adminOpsRoute)

// listen
app.listen(port, () => {
  console.log(`server running at http://${process.env.host}:${port}`);
});

module.exports = app;
app.listen()