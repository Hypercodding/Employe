// inventory.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  item: { 
    type: Schema.Types.ObjectId, 
    ref: 'Item', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  // ... other inventory-related fields
});

const Inventory = mongoose.model('Inventory', InventorySchema);
module.exports = Inventory;
