const mongoose = require('mongoose');
const { Schema } = mongoose;
// const Cmp = require('./Cmp');

const ItemSchema = new Schema({
  // cmp: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Cmp',
  // },
  itemName: {
    type: String,
    required: true,
    unique: true,
  },
  itemNo: {
    type: String,
    unique: true,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;