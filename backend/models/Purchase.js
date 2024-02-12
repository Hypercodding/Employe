// models/Purchase.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
    itemName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amountPerPiece: {
        type: Number,
        required: true
    },
    TotalAmount: {
      type: Number,
      required: true
  },
    vendorName: {
        type: String,
        required: true
    },
    bankName: {
        type: String,
        required: true
    },
    receipt: {
        type: String  // You can store the file path or use a cloud storage link for the receipt
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    }
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;
