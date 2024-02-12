const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the Employee model
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  durationMonths: {
    type: Number,
    required: true,
  },
  remainingAmount: {
    type: Number,
    required: true,
    default: function () {
      return this.amount;
    },
  },
  // Add any other fields you may need
}, { timestamps: true });

const Loan = mongoose.model('Loan', loanSchema);

module.exports = Loan;
