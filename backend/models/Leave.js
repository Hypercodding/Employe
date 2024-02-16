const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  days: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true,
    default: new Date().getFullYear() // Set the default value to the current year
  },
  isDeducted: {
    type: Boolean,
    default: false
  }
});

const Leave = mongoose.model('Leave', leaveSchema);

module.exports = Leave;
