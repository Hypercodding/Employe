const mongoose = require('mongoose');
const { Schema } = mongoose;
 


const EmpSchema = new Schema ({
    // user  : {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'user'
    // },
    name: {
        type: String,
        required: true,
        },
    dob: {
        type: Date,
        
        },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true,
        },
    cnic: {
        type: String,
        required: true,
        },
    salary:{
        type: String,
        required: true
    },
    job_title: {
        type: String,
        required: true,
        },
    department: {
        type: String,
        required: true,
        },
    date_of_hire: {
        type: Date,
        required: true,
        },
    employee_status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        },
    phone_number: {
        type: String,
        },
    leave_balance: {
        type: Number,
        default: 0,
        },
    employee_photo: {
        type: String, // Assuming you store the photo URL or path
        },
})

module.exports = mongoose.model("emp", EmpSchema);