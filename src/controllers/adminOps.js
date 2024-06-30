const AgentStatusRequest = require('../models/agentStatusRequest');
const saveToCloudinary = require('../functions/saveToCloudinary');
const { transporter, mailOptions } = require("../utils/nodemailer.config");
const { htmlBodyTemplates } = require("../utils/sendMail");
const User = require('../models/user');
const { query } = require('express');


// Create a new agent status request
const requestAgencyStatus = async (req, res) => {
  let data = {
        ...req.body,
        approved: false,
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
        ...req.body
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

    // Save the updated request
    await agencyRequest.save();

    res.status(200).json({ success: "Agency request approved", agencyRequest });
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

const searchForAgent = async (req,res) => {
  let {state,LGA,location} = req.query
  let query = {}
    // Add location filter if provided
    if(state){
      query.state = state
    }
    if(LGA){
      query.LGA = LGA
    }
    if (location) {
      // Split the location string by dashes and create regex patterns for each keyword
      const keywords = location.split("-");
      const locationRegexArray = keywords.map((keyword) => ({
        officeAddress: { $regex: keyword, $options: "i" },
      }));
      // Create a $or condition for each regex pattern
      query.$or = locationRegexArray;
      try {
        let foundAgents = await AgentStatusRequest.find(query)
        console.log({foundAgents})
        return res.status(200).json(foundAgents)
      }
      catch(err){
        return res.status(500).send({error: err.message})
      }
    }
  }

module.exports = {
  requestAgencyStatus,
  updateAgencyStatusPassport,
  updateAgencyStatusIssuedId,
  updateAgencyStatus,
  approveAgencyRequest,
  getApprovedAgencyRequests,
  getUnapprovedAgencyRequests,
  getAgencyRequestById,
  searchForAgent
};
