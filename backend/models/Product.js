// product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const productSchema = new Schema({
  productName: {
    type: String,
    required: true,
    unique: true,
  },
  items: [
    {
      item: {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
