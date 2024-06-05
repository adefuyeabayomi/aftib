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

Signup
```bash
curl -X POST http://localhost:8080/auth/signup \
-H "Content-Type: application/json" \
-d '{"email": "your_email_value", "password": "your_password_value","mobileNumber": "mobileNumberValue","name": "nameValue","signupType": "emailAndPassword"}'
```

Login
```bash
curl -X POST http://localhost:8080/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "your_email_value", "password": "your_password_value"}'
```
Response if successful 
```bash
response {token: 'tokenString'}
```


Response if there is an error. An error could occur for two reasons

1. An unexpected technical error in the server. In this case a 500 Internal Server Error is sent as a response.

2. During if invalid credentials are sent, then a 400 or 401 status is sent as a response.

```bash
response {error: 'errorMessage'}
```

## Listing Management

The Listing API allows users to create, read, update, and delete real estate listings. It provides endpoints for managing listings, including adding new listings, updating existing ones, fetching listings by various criteria, and deleting listings. 

## Available Endpoints
- **POST** `/listing/addListing`
- **PUT** `/listing/updateListing/:id`
- **GET** `/listing/getListingById/:id`
- **GET** `/listing/getListings`
- **DELETE** `/listing/deleteListingById/:id`
- **GET** `/listing/searchListings`

## Endpoints Documentation

### 1. Add a New Listing
- **Endpoint**: `/api/addListing`
- **Method**: POST
- **Body**:
    ```json
    {
        "description": "A beautiful 3-bedroom apartment located in the heart of Lagos.",
        "propertyType": "Apartment",
        "location": "Abule Egba, Lagos",
        "estate": "Sunshine Estate",
        "price": 150000,
        "state": "Lagos",
        "LGA": "Ifako-Ijaiye",
        "saleType": "Rent",
        "title": "3-Bedroom Apartment in Abule Egba",
        "bedrooms": 3,
        "bathrooms": 2,
        "size": 120,
        "yearBuilt": 2015,
        "amenities": ["Parking", "Gym", "Swimming Pool"],
        "images": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
        "contact": {
            "name": "Adeyemi Adebayo",
            "phone": "08012345678",
            "email": "adeyemi.adebayo@example.com"
        },
        "availableFrom": 1719792000000,
        "listingDate": 1717440000000,
        "furnished": true,
        "petsAllowed": false,
        "energyRating": "A",
        "nearbySchools": ["Sunshine Primary School", "Bright Future High School"],
        "transportation": "Near main bus route",
        "garage": true,
        "garden": true,
        "balcony": true,
        "floorNumber": 2,
        "propertyStatus": "Available",
        "neighborhood": "Safe and quiet neighborhood",
        "virtualTour": "http://example.com/virtualtour",
        "listingAgent": {
            "name": "Oluwaseun Johnson",
            "phone": "08087654321",
            "email": "oluwaseun.johnson@example.com"
        }
    }
    ```
    # Note: props availableFrom and ListingDate should be a number which can be gotten from new Date().getTime() .Passing a Date object would throw an error.
- **Response**:
    ```json
    {
        "message": "Listing added successfully",
        "listing": { ... }
    }
    ```

### 2. Update an Existing Listing
- **Endpoint**: `/listing/updateListing/:id`
- **Method**: PUT
- **Params**: 
    - `id` (String) - The ID of the listing to update.
- **Body**:
    ```json
    {
        "description": "Updated description",
        "price": 160000
    }
    ```
- **Response**:
    ```json
    {
        "message": "Listing updated successfully",
        "listing": { ... }
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

### 4. Get All Listings
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
    - `location` (String) - Keywords to search in the location field (e.g., "abule-egba").
    - `priceRange` (String) - Price range to filter listings (e.g., "100000-200000").
- **Response**:
    ```json
    {
        "listings": [ ... ]
    }
    ```





