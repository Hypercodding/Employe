const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ErpCompanySchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  
  createdAt: {
    type: Date,
    default: Date.now  // Set the default value to the current date and time   
}
  // ... other employee-related fields
});

const ErpCompany = mongoose.model('ErpCompany', ErpCompanySchema);
module.exports = ErpCompany;
