const mongoose = require('mongoose')

const listingSchema = mongoose.Schema({
    description: String,
    propertyType: String,
    location: String,
    estate: String,
    price: Number,
    state: String,
    LGA: String,
    saleType: String
})

const listingModel = mongoose.model("Listing",listingSchema)

module.exports = listingModel
/*
    description: a description of the property,
    propertyType: Bungalow, 2 bedroom,,
    location: Area where the property is located,
    estate: true,
    price: 8980490,
    state: Osun State,
    LGA: Ogbomosho,
    saleType: Rent or Sale,
    imagesLinks: []
    ...... other informations
*/





