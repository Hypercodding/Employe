// product.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductItemSchema = new Schema({
  item: { type: Schema.Types.ObjectId, ref: 'Item', required: true },
  quantity: { type: Number, required: true },
});

const ProductSchema = new Schema({
  name: { type: String, required: true },
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  items: [ProductItemSchema],
  // ... other product-related fields
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
