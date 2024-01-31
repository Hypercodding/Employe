// models/Cmp.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const CmpSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now

    }
});

module.exports = mongoose.model("Cmp", CmpSchema);
