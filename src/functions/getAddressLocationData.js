let apiKey = process.env.GEOCODE_API_KEY
const axios = require('axios');

async function getAddressLocationData(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log({response: response.data})
    if (response.data.status === 'OK') {
      const locationData = response.data.results[0];
      console.log('Location Data:', locationData);
      return locationData;
    } else {
      console.error('Geocoding error:', response.data.status);
      return null;
    }
  } catch (error) {
    console.error('Error making request:', error);
    return null;
  }
}

module.exports = getAddressLocationData




