// employee.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  designation: { 
    type: String, 
    required: true 
  },
  
  salary: {
    type: Number,
    required: true
  },
  cnic: {
    type: Number,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  employeeStatus: {
    type: String,
    enum: ['Active', 'InActive'], 
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'], 
    required: true
  },
  dateOfBirth: {
    type: Date,
    require: true
  },
  dateOfHiring: {
    type: Date,
    require: true
  },
  company: { 
    type: Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  position: String,
  overTime: {
    type: Boolean,
    default: false,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now  // Set the default value to the current date and time   
}
  // ... other employee-related fields
});

const Employee = mongoose.model('Employee', EmployeeSchema);
module.exports = Employee;
