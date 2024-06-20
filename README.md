# Aftib-site-back-end

This is an API documentation of Aftib. This backend project is created with express and mongoose.

To get the project up and running, navigate to the root directory and install the depedencies by running npm install in the terminal

```bash
npm install
```

The project can be run in two modes: development mode and production mode.

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm run start
```

### Ping Request

Once the server is running, you can send a ping request to the server.

```javascript
axios
  .get("http://localhost:8080/")
  .then((response) => {
    console.log("Ping successful:", response.data);
  })
  .catch((error) => {
    console.error("There was an error making the request:", error);
  });
```

Response

```bash
    'awake'
```

## Testing

The project's test covers integration tests. The testing utilizes Jest and Supertest to run tests. To start the testing, use the command:

```bash
npm run test
```

## Authentications API

### Usage Guide

The authentication the Login and Signup.

After getting the server running[dev], it would be running on port 8080, then you can utilize auth utilities.

## Endpoint Documentation

Login

```javascript
const axios = require("axios");

const requestBody = {
  email: "your_email_value",
  password: "your_password_value",
};

axios
  .post("http://localhost:8080/auth/login", requestBody, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("There was an error making the request:", error);
  });
```

Response if successful

```bash
200 OK - body => {token: 'tokenString'}
```

Sign Up. For the signup there are different account types, ADMIN, SELLER, BUYER, AGENT

```javascript
const axios = require("axios");

const signupRequestBody = {
  email: "newuser@example.com",
  password: "NewUserP@ssw0rd",
  signupType: "emailAndPassword",
  mobileNumber: "5551234567",
  name: "Adeola Adebayo",
  accountType: "buyer", // or "agent", "admin", "seller"
};

axios
  .post("http://localhost:8080/auth/signup", signupRequestBody, {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error("There was an error making the request:", error);
  });
```

Response if successful

```bash
201 CREATED - body => {token: 'tokenString'}
```

Response if there is an error. An error could occur for two reasons

1. An unexpected technical error in the server. In this case a 500 Internal Server Error is sent as a response.

2. if invalid credentials are sent, then a 400 or 401 status is sent as a response.

3. if you try to sign up an existing user, then a 409 conflict status code is sent.

```bash
400 | 409 | 404 {error: 'errorMessage'}
```

## Listing Management

The Listing API allows users to create, read, update, and delete real estate listings. It provides endpoints for managing listings, including adding new listings, updating existing ones, fetching listings by various criteria, and deleting listings.

### The Listing Object

```javascript
let listingObj = {
  // Existing Properties
  title: String, // Title of the listing
  description: String, // Detailed description of the property
  propertyType: String, // Type of property (e.g., apartment, house, condo)
  location: String, // General location or address
  estate: String, // Name of the estate, if applicable
  price: Number, // Price of the property
  monthlyRentPayment: Number, // Amount to be paid if it is a rental on a monthly basis
  state: String, // State where the property is located
  LGA: String, // Local Government Area
  saleType: String, // Type of sale (e.g., for sale, for rent)

  // Additional Properties
  bedrooms: Number, // Number of bedrooms
  bathrooms: Number, // Number of bathrooms
  size: Number, // Size of the property in square feet or meters
  yearBuilt: Number, // Year the property was built
  amenities: [String], // List of amenities (e.g., pool, gym, parking)
  images: [String], // URLs to images of the property
  ownersContact: {
    // Owners Contact Details
    name: String,
    phone: String,
    email: String,
  },
  availableFrom: Number, // Date when the property is available [new Date.getTime()]
  listingDate: Number, // Date when the listing was created [new Date.getTime()]
  furnished: Boolean, // Indicates if the property is furnished
  petsAllowed: Boolean, // Indicates if pets are allowed
  energyRating: String, // Energy efficiency rating
  nearbySchools: [String], // List of nearby schools
  transportation: String, // Information about nearby public transportation
  garage: Boolean, // Indicates if there is a garage
  garden: Boolean, // Indicates if there is a garden
  balcony: Boolean, // Indicates if there is a balcony
  floorNumber: Number, // The floor number if it's an apartment
  propertyStatus: String, // Current status (e.g., available, under contract, sold)
  neighborhood: String, // Additional details about the neighborhood
  virtualTour: String, // URL to a virtual tour of the property
  agentContact: {
    // Agent Details if created from agent account.
    name: String,
    phone: String,
    email: String,
  },
  createdBy: String, // userId that created the listing
  listingId: String, // generated by the server
  sid: String, // generated by the server
};
```

### Note: props availableFrom and ListingDate should be a number which can be gotten from new Date().getTime() .Passing a Date object would throw an error.

## Available Endpoints

- **POST** `/listing/addListing`
- **PUT** `/listing/updateListing/:id`
- **GET** `/listing/getListingById/:id`
- **GET** `/listing/getListings`
- **DELETE** `/listing/deleteListingById/:id`
- **GET** `/listing/searchListings`

## Endpoints Documentation

### 1. Add a New Listing

- **Endpoint**: `/listing/addListing`
- **Method**: POST

```javascript
const axios = require("axios");

const listingObj = {
  title: "Spacious 3 Bedroom Apartment in Lekki",
  description:
    "A beautiful and spacious 3 bedroom apartment located in a serene environment in Lekki. The apartment comes with modern amenities and is close to essential services.",
  propertyType: "apartment",
  location: "Lekki Phase 1",
  estate: "Peace Estate",
  price: 50000000,
  monthlyRentPayment: 250000,
  state: "Lagos",
  LGA: "Eti-Osa",
  saleType: "for sale",
  bedrooms: 3,
  bathrooms: 2,
  size: 150,
  yearBuilt: 2018,
  amenities: ["pool", "gym", "parking"],
  ownersContact: {
    name: "Adeyemi Balogun",
    phone: "08012345678",
    email: "adeyemi.balogun@example.com",
  },
  availableFrom: 1689010800000,
  listingDate: 1689010800000,
  furnished: true,
  petsAllowed: true,
  energyRating: "A",
  nearbySchools: ["Lekki British School", "Greensprings School"],
  transportation: "Close to Lekki Toll Gate",
  garage: true,
  garden: true,
  balcony: true,
  floorNumber: 2,
  propertyStatus: "available",
  neighborhood: "Safe and secure with 24/7 security",
  virtualTour: "http://example.com/virtualtour",
  agentContact: {
    name: "Olufunmi Ajayi",
    phone: "08098765432",
    email: "olufunmi.ajayi@example.com",
  },
};

axios
  .post("http://localhost:8080/api/addListing", JSON.stringify(listingData), {
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer YOUR_ACCESS_TOKEN_HERE",
    },
  })
  .then((response) => {
    console.log("Listing created successfully:", response.data);
  })
  .catch((error) => {
    console.error("There was an error creating the listing:", error);
  });
```

- **Response**:
  ```json
  {
    "message": "Listing added successfully"
  }
  ```

### 2. Update an Existing Listing

- **Endpoint**: `/listing/updateListing/:id`
- **Method**: PUT
- **Params**:
  - `id` (String) - The ID of the listing to update.
- **Body**:

```javascript
lelt listingUpdateData = {
  price: 30000000,
    agentContact: {
    name: "Olufunmi Zainab",
    phone: "08098765432",
    email: "olufunmi.zainab@example.com",
  },
}
axios
  .put(`http://localhost:8080/listing/updateListing/${listingId}`, JSON.stringify(listingUpdateData), {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE",
    },
  })
  .then((response) => {
    console.log("Listing updated successfully:", response.data);
  })
  .catch((error) => {
    console.error("There was an error updating the listing:", error);
  });
```

- **Response**:
  ```json
  {
    "message": "Listing updated successfully"
  }
  ```

### 3. Get a Listing by ID

- **Endpoint**: `/listing/getListingById/:id`
- **Method**: GET
- **Params**:
  - `id` (String) - The ID of the listing to retrieve.
- **Response**:
  ```json
  {
      "listing": { ... }
  }
  ```

### 4. Get Listings

- **Endpoint**: `/listing/getListings/:sectionNo`
- **Method**: GET
- **Params**:
  - `sectionNo` (String) - the listings are separated into groups of 30's so to get the first 30 listings in the data base. call the endpoint with sectionNo = 1 i.e /listing/getListings/1, to get the next 30, sectionNo becomes 2 and so one.
- **Response**:
  ```json
  {
      "listings": [ ... ]
  }
  ```

### 5. Delete a Listing by ID

- **Endpoint**: `/listing/deleteListingById/:id`
- **Method**: DELETE
- **Params**:
  - `id` (String) - The ID of the listing to delete.

```js
const listingId = "your_listing_id"; // Replace with the actual listing ID

axios
  .delete(`http://localhost:8080/listing/deleteListingById/${listingId}`, {
    headers: {
      Authorization: "Bearer YOUR_ACCESS_TOKEN_HERE",
    },
  })
  .then((response) => {
    console.log("Listing deleted successfully:", response.data);
  })
  .catch((error) => {
    console.error("There was an error deleting the listing:", error);
  });
```

- **Response**:

```json
{
  "message": "Listing deleted successfully"
}
```

### 6. Search Listings

- **Endpoint**: `/listing/searchListings?query=value`
- **Method**: GET
- **Queries**:
  - `location` (String) - Keywords to search in the location field (e.g. "abule-egba"). Multiple keywords should be separated by hyphens.
  - `priceRange` (String) - Price range to filter listings (e.g., "100000-200000").
  - `salesType` (String) - Type of sale (e.g., "sale", "rental").
  - `monthlyPaymentRange` (String) - Monthly payment range for rentals (e.g., "5000-10000").
  - `bedRooms` (Number) - Number of bedrooms.
  - `bathRooms` (Number) - Number of bathrooms.
    How the request url would look like.

```bash
/listing/searchListings?location=abule-egba&priceRange=100000-200000&saleType=sale&bedrooms=3&bathrooms=2
```

How to search with axios

```javascript
function searchRequest({
  location,
  priceRangeMin,
  priceRangeMax,
  monthlyPaymentMin,
  monthlyPaymentMax,
  bedRooms,
  bathRooms,
}) {
  const endpoint = "http://localhost:8080/listing/searchListings";
  // Create query parameters
  const createQuery = (option, value) => (value ? `${option}=${value}` : "");
  let queryParams = [];
  queryParams.push(createQuery("location", location));
  queryParams.push(
    createQuery("priceRange", `${priceRangeMin}-${priceRangeMax}`),
  );
  queryParams.push(createQuery("salesType", salesType));
  queryParams.push(
    createQuery(
      "monthlyPaymentRange",
      `${monthlyPaymentMin}-${monthlyPaymentMax}`,
    ),
  );
  queryParams.push(createQuery("bedRooms", bedRooms));
  queryParams.push(createQuery("bathRooms", bathRooms));
  //filter unused queries
  queryParams = queryParams.filter((param) => param !== "");

  // Build the full query string
  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
  // Send the request with axios
  axios
    .get(`${endpoint}${queryString}`)
    .then((response) => {
      console.log("Search results:", response.data);
    })
    .catch((error) => {
      console.error("There was an error with the search request:", error);
    });
}
```

for rentals you can search with monthlyPaymentRange instead of priceRange. teh response gives an array of listings that match the search queries.

- **Response**:
  ```json
  {
      "listings": [ ... ]
  }
  ```

Here's a quick guide and illustration for using the endpoint to add images to a listing.

## Adding Images to a Listing

### Endpoint

**Method**: POST  
**URL**: `/listing/addListingImages/:id`

### Request Parameters

- `id` (URL parameter): The ID of the listing to which you want to add images.

### Request Body

- `files` (form-data): Multiple image files to be uploaded.

### Example HTML Form

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Upload Images</title>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
  </head>
  <body>
    <h1>Upload Images to Listing</h1>
    <form id="uploadForm">
      <input type="file" id="files" name="files" multiple /><br /><br />
      <button type="button" onclick="uploadImages()">Upload</button>
    </form>

    <script>
      function uploadImages() {
        const listingId = "YOUR_LISTING_ID"; // Replace with your actual listing ID
        const formData = new FormData();
        const files = document.getElementById("files").files;

        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }

        axios
          .post(
            `http://localhost:8080/listing/addListingImages/${listingId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                authorization: "Bearer tokenString",
              },
            },
          )
          .then((response) => {
            console.log("Images uploaded successfully:", response.data);
          })
          .catch((error) => {
            console.error("Error uploading images:", error);
          });
      }
    </script>
  </body>
</html>
```

### Explanation

1. **HTML Form**: This simple form contains a file input allowing multiple file selection and a button to trigger the upload.
2. **JavaScript with Axios**:
   - **Form Data**: Collects the files from the input and appends them to a `FormData` object.
   - **Axios POST Request**: Sends a POST request to the endpoint with the `FormData` containing the files.
3. **Listing ID**: Replace `YOUR_LISTING_ID` with the actual ID of the listing you want to update.

### Using the Endpoint

1. Open the HTML file in your browser.
2. Select the image files you want to upload.
3. Click the "Upload" button.
4. The selected images will be sent to your server and added to the specified listing.

This setup allows you to easily upload multiple images to a specific listing by making a POST request with the files as form-data using Axios.

Sure! Below is the comprehensive Markdown documentation for the Hotel CRUD operations, including the example Axios requests and the additional provided information.

# Hotel Operations

## Introduction

This documentation covers the CRUD (Create, Read, Update, Delete) operations for managing hotel data. The endpoints allow clients to create new hotels, retrieve hotel information, update hotel details, and delete hotels from the database.

## Hotel Object

The hotel object represents the data structure used to store hotel information in the database. The schema is defined as follows:

```javascript
const HotelSchema = new mongoose.Schema({
    name: { type: String }, // Hotel name
    description: { type: String }, // Detailed description of the hotel
    address: { type: String }, // Full address
    location: { 
        city: { type: String }, // City
        state: { type: String }, // State
        country: { type: String }, // Country
        zipCode: { type: String }, // Zip code
        latitude: { type: Number }, // Latitude for geolocation
        longitude: { type: Number } // Longitude for geolocation
    },
    contact: { 
        phone: { type: String }, // Contact phone number
        email: { type: String }, // Contact email
        website: { type: String } // Website URL
    },
    amenities: [String], // List of amenities (e.g., pool, gym, spa)
    rooms: [{
        roomType: { type: String }, // Type of room (e.g., single, double, suite)
        description: { type: String }, // Description of the room
        price: { type: Number }, // Price per night
        amenities: [String], // List of room-specific amenities
        images: [String], // URLs to images of the room
        maxOccupancy: { type: Number }, // Maximum number of occupants
        availability: { type: Boolean, default: true } // Availability status
    }],
    images: [String], // URLs to images of the hotel
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who gave the rating
        rating: { type: Number, min: 1, max: 5 }, // Rating value
        comment: { type: String } // Comment from the user
    }],
    averageRating: { type: Number, default: 0 }, // Average rating of the hotel
    policies: { 
        checkIn: { type: String }, // Check-in time
        checkOut: { type: String }, // Check-out time
        cancellation: { type: String } // Cancellation policy
    },
    nearbyAttractions: [String], // List of nearby attractions
    createdDate: { type: Date, default: Date.now }, // Date when the hotel was added
    updatedDate: { type: Date, default: Date.now }, // Date when the hotel details were last updated
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // userId that created the listing
});
```

## Available Endpoints

### Create a New Hotel

**Endpoint:** 
- `POST /hotels`
- `POST http://localhost:8080/hotels`
- `GET http://localhost:8080/hotels/getAll/:sectionNo`
- `GET http://localhost:8080/hotels/:id`
- `PUT http://localhost:8080/hotels/:id`
- `DELETE http://localhost:8080/hotels/:id`
- `PUT http://localhost:8080/hotels/addImages/:id`



.
# Add New Hotel

## Endpoint
**POST** `http://localhost:8080/hotels`

## Description
This endpoint allows you to add a new hotel.

## Request Body
The body of the request should contain the hotel details. Example:

```json
{
  "name": "Hotel California",
  "location": "Los Angeles, CA",
  "rooms": [
    {
      "roomType": "Deluxe",
      "price": 150,
      "amenities": ["Wi-Fi", "TV", "Mini Bar"]
    },
    {
      "roomType": "Suite",
      "price": 300,
      "amenities": ["Wi-Fi", "TV", "Mini Bar", "Jacuzzi"]
    }
  ],
  "images": [],
  "description": "A lovely place where you can relax and enjoy.",
  "createdBy": "60d0fe4f5311236168a109ca"
}
```

## Example Axios Request

```javascript
const axios = require('axios');

const addHotel = async () => {
  const hotelData = {
    name: "Hotel California",
    location: "Los Angeles, CA",
    rooms: [
      {
        roomType: "Deluxe",
        price: 150,
        amenities: ["Wi-Fi", "TV", "Mini Bar"]
      },
      {
        roomType: "Suite",
        price: 300,
        amenities: ["Wi-Fi", "TV", "Mini Bar", "Jacuzzi"]
      }
    ],
    images: [],
    description: "A lovely place where you can relax and enjoy."
  };

  try {
    const response = await axios.post('http://localhost:8080/hotels', hotelData, {
      headers: {
        Authorization: `Bearer YOUR_ACCESS_TOKEN`
      }
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

addHotel();
```
.

# Get All Hotels

## Endpoint
**GET** `http://localhost:8080/hotels/getAll/:sectionNo`

## Description
This endpoint allows you to retrieve a list of all hotels, paginated by sections.

## Parameters
- `sectionNo`: The page number to retrieve. For example, `1` for the first page.

## Example Axios Request

```javascript
const axios = require('axios');

const getAllHotels = async (sectionNo) => {
  try {
    const response = await axios.get(`http://localhost:8080/hotels/getAll/${sectionNo}`);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

getAllHotels(1); // Replace 1 with the desired section number

```

.
# Get Hotel By ID

## Endpoint
**GET** `http://localhost:8080/hotels/:id`

## Description
This endpoint allows you to retrieve a hotel by its ID.

## Parameters
- `id`: The ID of the hotel to retrieve.

## Example Axios Request

```javascript
const axios = require('axios');

const getHotelById = async (hotelId) => {
  try {
    const response = await axios.get(`http://localhost:8080/hotels/${hotelId}`);
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

getHotelById('your-hotel-id-here'); // Replace 'your-hotel-id-here' with the actual hotel ID

```

.
# Update Hotel By ID

## Endpoint
**PUT** `http://localhost:8080/hotels/:id`

## Description
This endpoint allows you to update a hotel by its ID.

## Parameters
- `id`: The ID of the hotel to update.

## Request Body
- The request body should contain JSON data with the fields you want to update for the hotel.

## Example Axios Request

```javascript
const axios = require('axios');

const updateHotelById = async (hotelId, updatedData, authToken) => {
  try {
    const response = await axios.put(`http://localhost:8080/hotels/${hotelId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const hotelIdToUpdate = 'your-hotel-id-here'; // Replace 'your-hotel-id-here' with the actual hotel ID
const updatedData = {
  name: 'Updated Hotel Name',
  address: 'Updated Hotel Address',
  rating: 4.5,
  rooms: [
    {
      type: 'Single Room',
      price: 100,
    },
    {
      type: 'Double Room',
      price: 150,
    },
  ],
};
const authToken = 'your-auth-token'; // Replace 'your-auth-token' with a valid JWT token

updateHotelById(hotelIdToUpdate, updatedData, authToken);
```

.
# Delete Hotel By ID

## Endpoint
**DELETE** `http://localhost:8080/hotels/:id`

## Description
This endpoint allows you to delete a hotel by its ID.

## Parameters
- `id`: The ID of the hotel to delete.

## Authorization
- This endpoint requires authentication. Ensure you include the Authorization header with a valid JWT token.

## Example Axios Request

```javascript
const axios = require('axios');

const deleteHotelById = async (hotelId, authToken) => {
  try {
    const response = await axios.delete(`http://localhost:8080/hotels/${hotelId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const hotelIdToDelete = 'your-hotel-id-here'; // Replace 'your-hotel-id-here' with the actual hotel ID
const authToken = 'your-auth-token'; // Replace 'your-auth-token' with a valid JWT token

deleteHotelById(hotelIdToDelete, authToken);
```


.


# Update Room Images By ID

## Endpoint
**PUT** `http://localhost:8080/hotels/addRoomImages/:hotelId/:roomId`

## Description
This endpoint allows you to update images for a specific room within a hotel by its IDs.

## Parameters
- `hotelId`: The ID of the hotel containing the room.
- `roomId`: The ID of the room to update.

## Authorization
- This endpoint requires authentication. Ensure you include the Authorization header with a valid JWT token.

## Request Body
- Use `multipart/form-data` format for uploading images.

## HTML Form Example
```html
<form action="http://localhost:8080/hotels/addRoomImages/:hotelId/:roomId" method="POST" enctype="multipart/form-data">
  <input type="file" name="images" multiple>
  <input type="submit" value="Upload Images">
</form>
```

## Example Axios Request
To perform this request programmatically with Axios, use `FormData` to handle the file input.

```javascript
const axios = require('axios');

const updateRoomImages = async (hotelId, roomId, imagesFormData, authToken) => {
  try {
    const response = await axios.put(`http://localhost:8080/hotels/addRoomImages/${hotelId}/${roomId}`, imagesFormData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const hotelIdToUpdate = 'your-hotel-id-here'; // Replace 'your-hotel-id-here' with the actual hotel ID
const roomIdToUpdate = 'your-room-id-here'; // Replace 'your-room-id-here' with the actual room ID
const imagesFormData = new FormData();
imagesFormData.append('images', fileInputElement.files[0]); // Assuming fileInputElement is your file input element
const authToken = 'your-auth-token'; // Replace 'your-auth-token' with a valid JWT token

updateRoomImages(hotelIdToUpdate, roomIdToUpdate, imagesFormData, authToken);
```

Replace `'your-hotel-id-here'`, `'your-room-id-here'`, and `'your-auth-token'` with actual values specific to your application.

.

# Transactions APIs

Transactions in our application represent various financial activities performed by users, including property purchases, rentals, and hotel bookings. Each transaction captures essential details such as transaction type, status, payment information, and associated user IDs. This documentation outlines the structure of our transaction schema and provides insights into how transactions are managed within our system.

---

### Transaction Object

The transaction object in our system adheres to the following schema:

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  clientId: {
    type: String,
    required: true,
    ref: "User",
  },
  providerId: {
    type: String,
    required: true,
    ref: "User",
  },
  transactionType: {
    type: String,
    required: true,
    enum: ["propertyPurchase", "propertyRental", "hotelBooking"], 
  },
  transactionStatus: {
    type: String,
    required: true,
    enum: ["pending", "success", "cancelled"],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["pending", "paid", "failed"],
  },
  date: {
    type: Number,
    required: true,
  },
  propertyId: {
    type: String,
    ref: "Listing", // Reference to the Property model if applicable
  },
  hotelId: {
    type: String,
    ref: "Hotel", // Reference to the Hotel model if applicable
  },
  bookingDetails: {
    room: Object,
    startDate: Date,
    endDate: Date,
    totalNights: Number,
    price: Number,
  },
  rentDetails: {
    startDate: Date,
    endDate: Date,
    totalMonths: Number,
    price: Number,
  },
  purchaseDetails: {
    price: Number,
  },
  narration: {
    type: String,
  },
  RRR: {
    type: String,
  },
  RemitaOneTimeID: {
    type: String,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
```
---
Here are the available transaction endpoints in our application:
---
- **POST /create-transaction**
  - Endpoint to create a new transaction.
  - Requires authentication using JWT token.
  - Body parameters:
    - `propertyId` (String, optional): ID of the property involved in the transaction.
    - `hotelId` (String, optional): ID of the hotel involved in the transaction.
    - `bookingDetails` (Object, optional): Details related to hotel bookings, including room type, dates, and pricing.
    - `rentDetails` (Object, optional): Details related to property rentals, including start date, end date, duration, and pricing.
    - `transactionType` (String, required): Type of transaction (`propertyPurchase`, `propertyRental`, `hotelBooking`).
  - Example:
    ```javascript
    axios.post('http://localhost:8080/create-transaction', {
      propertyId: '607f1f77bcf86cd799439011',
      transactionType: 'propertyPurchase',
    }, {
      headers: {
        Authorization: `Bearer <JWT_TOKEN>`
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });
    ```
---
- **POST /initialize-payment**
  - Endpoint to initialize a payment for a transaction.
  - Requires authentication using JWT token.
  - Body parameters:
    - `transactionId` (String, required): ID of the transaction to initiate payment for.
  - Example:
    ```javascript
    axios.post('http://localhost:8080/initialize-payment', {
      transactionId: '6095ce3f1ab2b118cc3ef8e2'
    }, {
      headers: {
        Authorization: `Bearer <JWT_TOKEN>`
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });
    ```
---
- **POST /check-payment-status**
  - Endpoint to check the payment status of a transaction.
  - Requires authentication using JWT token.
  - Body parameters:
    - `transactionId` (String, required): ID of the transaction to check.
  - Example:
    ```javascript
    axios.post('http://localhost:8080/check-payment-status', {
      transactionId: '6095ce3f1ab2b118cc3ef8e2'
    }, {
      headers: {
        Authorization: `Bearer <JWT_TOKEN>`
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });
    ```
---
- **POST /check-rrr-payment-status**
  - Endpoint to check the Remita RRR payment status of a transaction.
  - Requires authentication using JWT token.
  - Body parameters:
    - `transactionId` (String, required): ID of the transaction to check.
  - Example:
    ```javascript
    axios.post('http://localhost:8080/check-rrr-payment-status', {
      transactionId: '6095ce3f1ab2b118cc3ef8e2'
    }, {
      headers: {
        Authorization: `Bearer <JWT_TOKEN>`
      }
    }).then(response => {
      console.log(response);
    }).catch(error => {
      console.error(error);
    });
    ```
---
These endpoints allow interaction with transaction-related functionalities in our application, facilitating creation, payment initiation, and status checking for various types of transactions such as property purchases, rentals, and hotel bookings. Each endpoint requires authentication using a JWT token for security and authorization purposes.
