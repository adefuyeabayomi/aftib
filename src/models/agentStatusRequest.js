const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AgentStatusRequestSchema = new Schema({
  passport: { type: String, required: true }, // URL of the passport photograph
  officeAddress: { type: String, required: true }, // Office address of the agent
  ninNumber: { type: String, required: true }, // NIN number of the agent
  agentId: { type: String, required: true, ref: 'User' }, // Agent ID, referencing the User model
  approved: Boolean
});

module.exports = mongoose.model('AgentStatusRequest', AgentStatusRequestSchema);
