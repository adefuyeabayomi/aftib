const nodemailer = require("nodemailer");

let BREVO_USER = process.env.BREVO_USER;
let BREVO_PASSWORD = process.env.BREVO_PASSWORD;
// Create a Nodemailer transporter using the Mailbit SMTP server details
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Replace with Mailbit SMTP server
  port: 587, // Typically, SMTP uses port 587 for TLS
  secure: false, // Set to true if using port 465, otherwise false for port 587
  auth: {
    user: BREVO_USER, // Replace with your Mailbit email address
    pass: BREVO_PASSWORD, // Replace with your Mailbit email password
  },
});

// Define email options
const mailOptions = {
  from: '"Aftib Real Estate" <adefuyeabayomi16@gmail.com>', // Sender address
  to: undefined, // List of receivers
  subject: "Verification", // Subject line
  html: undefined,
};

module.exports = { transporter, mailOptions };
