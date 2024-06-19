const saveToCloudinary = require("../functions/saveToCloudinary");

const saveListingImages = function (req, res) {
  let { id } = req.params;
  saveToCloudinary(req.files)
    .then((result) => {
      // the results should be appended to the listing with the provided id
      res.status(200).json({ message: "Files uploaded successfully", result });
    })
    .catch((error) => {
      res.status(500).json({ message: "Error uploading files", error });
    });
};

module.exports = { saveListingImages };
