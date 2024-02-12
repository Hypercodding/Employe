// pettyCash.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PettyCashSchema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  amount: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  // ... other petty cash-related fields
});

const PettyCash = mongoose.model('PettyCash', PettyCashSchema);
module.exports = PettyCash;
