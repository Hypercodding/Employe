// productionSale.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductionSaleSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  // ... other production sale-related fields
});

const ProductionSale = mongoose.model('ProductionSale', ProductionSaleSchema);
module.exports = ProductionSale;
