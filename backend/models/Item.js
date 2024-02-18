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
    type: Number,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('item', ItemSchema);
