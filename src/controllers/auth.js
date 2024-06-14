const User = require("../models/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const generateID = require("../utils/generateID");
const validateEmail = require("../utils/validate");
const { htmlBodyTemplates } = require("../utils/sendMail");
// Controller function for processing an order
const {transporter,mailOptions} = require('../utils/nodemailer.config')

const signup = async (req, res, next) => {
  let { email, password, mobileNumber, name, signupType, accountType } =
    req.body;
  //validate email and password
  if (!validateEmail(email)) {
    return res
      .status(400)
      .send({
        error: "Email is not valid",
        status: 400,
        message: "Bad Request",
      });
  }
  // check if user with that email does not exist
  let userExists = await User.find({ email });
  if (userExists.length > 0) {
    return res
      .status(409)
      .send({
        status: 409,
        message: "Conflict",
        error: "User with this email already exists! Login instead.",
      });
  }
  // create user
  let userId = generateID()
  let salt = bcrypt.genSaltSync(10)
  let hash = bcrypt.hashSync(password, salt)
  let UserDoc = new User({
    email,
    hash,
    userId,
    mobileNumber,
    name,
    signupType,
    accountType,
    verified: false,
  })
  // save user
  UserDoc.save()
    .then((data) => {
      // save success: generate and send JWT
      let userForToken = {
        email,
        userId,
        accountType,
        name,
        mobileNumber
      }
      let token = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60 * 6,
      })
      res.status(201).send({ token, user: userForToken })
        // Send email
        mailOptions.html = htmlBodyTemplates.verifyTemplate(userId)
        mailOptions.to = email
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log('Error occurred:', error)
          }
          console.log('Message sent:', info.messageId)
      })
    })
    .catch((err) => {
      // save error: send error message
      res.status(500).send({ error: err.message })
    })
}

const login = async (req, res) => {
  let { email, password } = req.body;
  let user = await User.findOne({ email });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.hash);
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
    userId: user.userId,
    accountType: user.accountType,
    name: user.name,
    mobileNumber: user.mobileNumber
  };

  const token = jwt.sign(userForToken, process.env.SECRET);
  return res.status(200).send({ token, user: userForToken  });
};

const verifyEmail = async (req, res) => {
  let id = req.params.id;
  User.updateOne({ userId: id }, { verified: true })
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
