const AgentStatusRequest = require('../models/AgentStatusRequest');
const saveToCloudinary = require('../functions/saveToCloudinary');
const { transporter, mailOptions } = require("../utils/nodemailer.config");
const { htmlBodyTemplates } = require("../utils/sendMail");
const User = require('../models/user')

const handleAgentStatusRequest = async (req, res) => {
  const { officeAddress, nin} = req.body;
  const agentId = req.user.userId; // Get agent ID from the authenticated user
  try {
    const uploadedUrls = await saveToCloudinary(req.files);
    const [passport] = uploadedUrls;
    const newRequest = new AgentStatusRequest({
      passport,
      officeAddress,
      ninNumber: nin,
      agentId,
      approved: false,
    });

    await newRequest.save();
    mailOptions.html = htmlBodyTemplates.agentRequestEmailNotification(req.user.name);
    mailOptions.to = req.user.email;
    mailOptions.subject = 'Agent Request Recieved'
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Message sent:", info.messageId);
    });
    let admins = await User.find({accountType: 'admin'})
    mailOptions.html = htmlBodyTemplates.agentRequestAdminEmailNotification(admins[0].name)
    mailOptions.to = admins[0].email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Message sent:", info.messageId);
    });
    res.status(200).json({ message: 'Agent status request submitted successfully', data: newRequest });
  } catch (error) {
    console.error('Error handling agent status request:', error);
    res.status(500).json({ message: 'Error handling agent status request', error });
  }
};

module.exports = {
  handleAgentStatusRequest
};
