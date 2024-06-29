const router = require("express").Router();
const {
  addNewHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  saveHotelImages,
  updateRoomImages,
  getUnapprovedHotels,
  approveHotelById,
} = require("../controllers/hotel")
const uploadImages = require("../functions/fileupload.middleware")
const verifyToken = require("../functions/verifyToken.middleware") // Assuming you have a middleware to verify JWT tokens

router.post("/hotels", verifyToken, addNewHotel);
router.get("/hotels/getAll/:sectionNo", getAllHotels);
router.get("/hotels/:id", getHotelById);
router.put("/hotels/:id", verifyToken, updateHotelById);
router.delete("/hotels/:id", verifyToken, deleteHotelById);
router.put("/hotels/addImages/:id", verifyToken, uploadImages, saveHotelImages);
router.put(
  "/hotels/addRoomImages/:hotelId/:roomId",
  verifyToken,
  uploadImages,
  updateRoomImages,
);
router.get("/hotels/unapproved/:page", getUnapprovedHotels);
router.put("/hotels/approve/:id", verifyToken, approveHotelById);
module.exports = router;
