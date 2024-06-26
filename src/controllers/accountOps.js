const User = require('../models/user'); // Adjust the path as necessary

// Helper function to check authorization
const checkAuthorization = (req, id) => {
  return req.user && req.user.userId === id;
};

const getUserListings = async (req, res) => {
  const { id } = req.params;
  if (!checkAuthorization(req, id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('myListings');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.myListings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
 
const getUserReservations = async (req, res) => {
  const { id } = req.params;
  if (!checkAuthorization(req, id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('myHotelReservations');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.myHotelReservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getMySales = async (req, res) => {
  const { id } = req.params;
  if (!checkAuthorization(req, id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('mySales');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.mySales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getMyHotels = async (req, res) => {
  const { id } = req.params;
  if (!checkAuthorization(req, id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('myHotels');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.myHotels);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getMyTransactions = async (req, res) => {
  const { id } = req.params;
  if (!checkAuthorization(req, id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('myTransactions');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.myTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getMyRentals = async (req, res) => {
  const { id } = req.params;
  if (!checkAuthorization(req, id)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  try {
    const user = await User.findById(id).select('myRentals');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.myRentals);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getMyHotelBookings = async (userId, token) => {
  try {
    const response = await axios.get(`http://localhost:8080/getMyHotelBookings/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
    getUserListings,
    getUserReservations,
    getMySales,
    getMyHotels,
    getMyTransactions,
    getMyRentals,
    getMyHotelBookings, // Add this line
  };
  