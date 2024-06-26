const router = require('express').Router();
const {
  getUserListings,
  getUserReservations,
  getMySales,
  getMyHotels,
  getMyTransactions,
  getMyRentals,
  getMyHotelBookings,
} = require('../controllers/accountOps');
const verifyToken = require('../functions/verifyToken.middleware'); // Adjust the path as necessary

router.get('/getUserListings/:id', verifyToken, getUserListings);
router.get('/getUserReservations/:id', verifyToken, getUserReservations);
router.get('/getMySales/:id', verifyToken, getMySales);
router.get('/getMyHotels/:id', verifyToken, getMyHotels);
router.get('/getMyTransactions/:id', verifyToken, getMyTransactions);
router.get('/getMyRentals/:id', verifyToken, getMyRentals);
router.get('/getMyHotelBookings/:id', verifyToken, getMyHotelBookings);

module.exports = router;



