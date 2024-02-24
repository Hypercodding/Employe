const mongoose = require('mongoose');
const { Schema } = mongoose;
 


const UserSchema = new Schema ({
    
    ErpCompany: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    password: { 
        type: String,
        required: true
    },
    role: { 
        type: String, 
        enum: ['Admin', 'Manager'], 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true, 
        unique: true 
    }, 
    // Add other user-related fields
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    companies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now  // Set the default value to the current date and time   
    },
    verificationCode: {
        type: String,
    }

});


// Static method to check if a user with the provided phone number exists
UserSchema.statics.findByPhoneNumber = async function (phoneNumber) {
    return this.findOne({ phoneNumber });
};


module.exports = mongoose.model("User", UserSchema);