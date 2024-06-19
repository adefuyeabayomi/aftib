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
