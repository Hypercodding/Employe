// models/Cmp.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CompanySchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
  users: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
    }],
  address: String,
  companyStatus: {
    type: String, 
    enum: ['Active', 'InActive'], 
    required: true 
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
},
createdAt: {
  type: Date,
  default: Date.now  // Set the default value to the current date and time   
}
});

module.exports = mongoose.model("Company", CompanySchema);
