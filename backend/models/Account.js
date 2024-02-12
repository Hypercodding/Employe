// models/Account.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    bankName: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0
    }
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
