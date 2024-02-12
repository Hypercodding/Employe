const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Reference to the Employee model
    required: true,
  },
  // baseSalary: {
  //   type: Number,
  //   required: true,
  // },
  deductLeaves: {
    type: Boolean,
    default: false,
  },
  deductedLeaves: {
    type: Number,
    default: 0,
  },
  totalLoanAmount: {
    type: Number,
    default: 0,
  },
  finalSalary: {
    type: Number,
    required: true,
  },
  // Add any other fields you may need
}, { timestamps: true });

const Salary = mongoose.model('Salary', salarySchema);

module.exports = Salary;
