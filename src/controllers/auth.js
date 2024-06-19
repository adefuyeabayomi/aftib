const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateEmail = require("../utils/validate");
const { htmlBodyTemplates } = require("../utils/sendMail");
// Controller function for processing an order
const { transporter, mailOptions } = require("../utils/nodemailer.config");

const signup = async (req, res) => {
  let { email, password, mobileNumber, name, signupType, accountType } =
    req.body;
  email = email.toLowerCase();

  // Validate email and password
  if (!validateEmail(email)) {
    return res.status(400).send({
      error: "Email is not valid",
      status: 400,
      message: "Bad Request",
    });
  }

  // Check if user with that email already exists
  let userExists = await User.find({ email });
  if (userExists.length > 0) {
    return res.status(409).send({
      status: 409,
      message: "Conflict",
      error: "User with this email already exists! Login instead.",
    });
  }

  // Create user
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);
  let UserDoc = new User({
    email,
    hash,
    signupType,
    mobileNumber,
    name,
    verified: false,
    accountType,
  });

  try {
    // Save user
    let savedUser = await UserDoc.save();

    // Save success: generate and send JWT
    let userForToken = {
      email,
      userId: savedUser._id,
      accountType,
      name,
      mobileNumber,
    };

    let token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60 * 6,
    });

    res.status(201).send({ token, user: userForToken });

    // Send email
    mailOptions.html = htmlBodyTemplates.verifyTemplate(savedUser._id);
    mailOptions.to = email;
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Message sent:", info.messageId);
    });
  } catch (err) {
    // Save error: send error message
    res.status(500).send({ error: err.message });
  }
};

const login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  const passwordCorrect =
    user === null ? false : bcrypt.compare(password, user.hash);
  if (!user) {
    return res.status(404).json({
      error: "Email has not been Registered.",
    });
  }
  if (!passwordCorrect) {
    return res.status(401).json({
      error: "Password does not match.",
    });
  }

  const userForToken = {
    email: user.email,
    userId: user._id,
    accountType: user.accountType,
    name: user.name,
    mobileNumber: user.mobileNumber,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  return res.status(200).send({ token, user: userForToken });
};

const verifyEmail = async (req, res) => {
  let id = req.params.id;
  User.findByIdAndUpdate(id, { verified: true })
    .then((result) => {
      return res.status(200).redirect("http://localhost:3000");
    })
    .catch((err) => {
      return res.status(400).json({
        error: err.message,
      });
    });
};

module.exports = {
  signup,
  login,
  verifyEmail,
};