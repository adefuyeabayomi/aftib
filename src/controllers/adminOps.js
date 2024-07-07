const AgentStatusRequest = require('../models/agentStatusRequest');
const saveToCloudinary = require('../functions/saveToCloudinary');
const { transporter, mailOptions } = require("../utils/nodemailer.config");
const { htmlBodyTemplates } = require("../utils/sendMail");
const User = require('../models/user');
const { query } = require('express');


// POST endpoint to handle contact form submission
const sendContactForm = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ error: 'All fields are required' });
    }

    try {
        // Set email options
        mailOptions.html = htmlBodyTemplates.contactForm({name, email, message});
        mailOptions.to = req.user.email; // The email where you want to receive the contact form submissions
        mailOptions.subject = `New Contact Form Submission from ${name}`;

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error occurred:", error);
                return res.status(500).send({ error: 'Failed to send email' });
            }
            console.log("Message sent:", info.messageId);
            res.status(200).send({ success: 'Message sent successfully' });
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}

// Create a new agent status request
const requestAgencyStatus = async (req, res) => {
  let data = {
        ...req.body,
        approved: false,
        approvalState: 'pending',
      agentId: req.user.userId, // assuming the agentId is available in req.user
    }
  try {
    console.log({data})
    const agentStatusRequest = new AgentStatusRequest(data);
    await agentStatusRequest.save();
    mailOptions.html = htmlBodyTemplates.agentRequestEmailNotification(req.user.name);
    mailOptions.to = req.user.email;
    mailOptions.subject = 'Agent Request Recieved'
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error occurred:", error);
      }
      console.log("Message sent:", info.messageId);
    });
    
    res.status(201).json({ success: "Agent status request created", agentStatusRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update the text fields of the agent status
const updateAgencyStatus = async (req, res) => {
  try {
    const agentStatusRequest = await AgentStatusRequest.findOneAndUpdate(
      { agentId: req.user.userId },
      {
        ...req.body, approvalState: 'pending'
      },
      { new: true }
    );

    res.status(200).json({ success: "Agent status updated", agentStatusRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update the issued ID photo
const updateAgencyStatusIssuedId = async (req, res) => {
  try {
    const imageUrl = await saveToCloudinary(req.files);
    const agentStatusRequest = await AgentStatusRequest.findOneAndUpdate(
      { agentId: req.user.userId },
      { IssuedId: imageUrl[0] },
      { new: true }
    );

    res.status(200).json({ success: "Issued ID updated", agentStatusRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update the passport photo
const updateAgencyStatusPassport = async (req, res) => {
  try {
    const imageUrl = await saveToCloudinary(req.files);
    const agentStatusRequest = await AgentStatusRequest.findOneAndUpdate(
      { agentId: req.user.userId },
      { passport: imageUrl[0] },
      { new: true }
    );

    res.status(200).json({ success: "Passport updated", agentStatusRequest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveAgencyRequest = async (req, res) => {
  const { requestId } = req.params; // Assuming you pass requestId in the URL params
 // Assuming approvedBy is provided in the request body

  try {
    // Find the agency status request by ID
    const agencyRequest = await AgentStatusRequest.findById(requestId);

    if (!agencyRequest) {
      return res.status(404).json({ error: "Agency request not found" });
    }
    if(req.user.accountType !== 'admin'){
      return res.status(401).json({error: "Only admins can approve"})
    }

    // Update the fields
    agencyRequest.approved = true;
    agencyRequest.approvedBy = req.user.userId;
    agencyRequest.approvalState = 'approved'

    // Save the updated request
    await agencyRequest.save();

    res.status(200).json({ success: "Agency request approved", agencyRequest });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const rejectAgencyRequest = async (req, res) => {
  const { requestId } = req.params; // Assuming you pass requestId in the URL params
  const {message} = req.query
  console.log(message)
 // Assuming approvedBy is provided in the request body

  try {
    // Find the agency status request by ID
    const agencyRequest = await AgentStatusRequest.findById(requestId);

    if (!agencyRequest) {
      return res.status(404).json({ error: "Agency request not found" });
    }
    if(req.user.accountType !== 'admin'){
      return res.status(401).json({error: "Only admins can approve"})
    }

    // Update the fields
    agencyRequest.approved = false;
    agencyRequest.approvalState = 'rejected'
    agencyRequest.rejectionMessage = message
    agencyRequest.approvedBy = req.user.userId;

    // Save the updated request
    await agencyRequest.save();

    res.status(200).json({ success: "Agency request rejected", agencyRequest });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getAgencyRequestById = async (req, res) => {
  const { id } = req.params
  try {
    const agencyRequest = await AgentStatusRequest.findById(id)

    if (!agencyRequest) {
      return res.status(404).json({ error: "Agency request not found" })
    }

    res.status(200).json(agencyRequest)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Server error" })
  }
}

const getAgencyRequestByToken = async (req, res) => {
  const id = req.user.userId
  try {
    const agencyRequest = await AgentStatusRequest.findOne({agentId: id})

    if (!agencyRequest) {
      return res.status(404).json({ error: "Agency request not found" })
    }

    res.status(200).json(agencyRequest)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Server error" })
  }
}

const getApprovedAgencyRequests = async (req, res) => {

  try {
    const requests = await AgentStatusRequest.find({approved: true})

    res.status(200).json(requests)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Server error" })
  }
}
 
const getUnapprovedAgencyRequests = async (req, res) => {

  try {
    const requests = await AgentStatusRequest.find({approved: false})

    res.status(200).json(requests)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: "Server error" })
  }
}

const searchForAgent = async (req, res) => {
  try {
    const { location } = req.query;
    let query = {}

    if (location) {
      // Split the location string by dashes and create regex patterns for each keyword
      const keywords = location.split('-');
      const locationRegexArray = keywords.map((keyword) => ({
        $or: [
          { officeAddress: { $regex: keyword, $options: 'i' } },
          { state: { $regex: keyword, $options: 'i' } },
          { LGA: { $regex: keyword, $options: 'i' } }
        ]
      }));
      // Combine all regex patterns into a single $and condition
      query.$and = locationRegexArray;
    }

    // Fetch agent status requests based on the query
    const agentStatusRequests = await AgentStatusRequest.find(query) // Assuming you want to limit results to 30 per batch
    res.status(200).json(agentStatusRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getClientAccounts = async (req, res) => {
  try {
    const page = parseInt(req.params.page, 10) || 1;
    const limit = 30;
    const skip = (page - 1) * limit;

    const users = await User.find({ accountType: 'client' })
      .skip(skip)
      .limit(limit);

    res.status(200).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  requestAgencyStatus,
  updateAgencyStatusPassport,
  updateAgencyStatusIssuedId,
  updateAgencyStatus,
  approveAgencyRequest,
  getApprovedAgencyRequests,
  getUnapprovedAgencyRequests, 
  getAgencyRequestById,
  searchForAgent,
  getAgencyRequestByToken,
  rejectAgencyRequest,
  sendContactForm,
  getClientAccounts
};
