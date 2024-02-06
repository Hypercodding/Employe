const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
 
  productName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now

  },
  customer: {
    type: String,
    required: true,
  },
  productQuantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    
  }
});

module.exports = mongoose.model('product', ProductSchema);
