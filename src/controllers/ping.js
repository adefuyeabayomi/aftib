const fs = require("fs");
const path = require("path");
const ping = (req, res) => {
  res.status(200).send("awake");
};

const getAccessLog = (req, res) => {
  const logFilePath = path.join(__dirname, "../access.log");

  fs.stat(logFilePath, (err, stats) => {
    if (err) {
      return res.status(404).send("Log file not found");
    }

    res.sendFile(logFilePath, (err) => {
      if (err) {
        res.status(500).send("Error reading log file");
      }
    });
  });
};

module.exports = {
  ping,
  getAccessLog,
};
