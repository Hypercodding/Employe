const mongoose = require('mongoose');
const { Schema } = mongoose;
const Cmp = require('./Cmp');

const ItemsSchema = new Schema({
  cmp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cmp',
  },
  itemName: {
    type: String,
    required: true,
    // unique: true,
  },
  date: {
    type: Date,
    default: Date.now

  },
  vendor: {
    type: String,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('items', ItemsSchema);
