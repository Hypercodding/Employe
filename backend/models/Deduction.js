// deduction.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeductionSchema = new Schema({
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  amount: { type: Number, required: true },
  // ... other deduction-related fields
});

const Deduction = mongoose.model('Deduction', DeductionSchema);
module.exports = Deduction;
