const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgentStatusRequestSchema = new Schema({
  name: String,
  businessName: String,
  phone: Number,
  whatsappNo: Number,
  email: String,
  officeAddress: { type: String}, // Office address of the agent
  state: String,
  LGA: String,
  locationData: Object,
  about: String,
  agencyType: String,
  CACRef: String,
  IssuedId: { type: String }, // URL of the passport photograph
  ninNumber: { type: String}, // NIN number of the agent
  passport: { type: String }, // URL of the passport photograph
  agentId: { type: String, required: true, ref: 'User' }, // Agent ID, referencing the User model
  approved: Boolean,
  approvedBy: String,
  facebookLink: String,
  instagramLink: String,
  twitterLink: String,
  approvalState: 'pending' // 'approved', 'rejected'
});

module.exports = mongoose.model('AgentStatusRequest', AgentStatusRequestSchema);
