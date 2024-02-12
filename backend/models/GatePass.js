// gatePass.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GatePassSchema = new Schema({
  gatePassNumber: { type: String, required: true, unique: true },
  inOut: { type: String, enum: ['In', 'Out'], required: true },
  image: { type: String, required: true }, // Assuming image is stored as a URL or file path
  timestamp: { type: Date, default: Date.now },
  // ... other gate pass-related fields
});

const GatePass = mongoose.model('GatePass', GatePassSchema);
module.exports = GatePass;
