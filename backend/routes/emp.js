const express = require('express');
const router = express.Router();
const Emp = require('../models/Emp');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')

//Route1: Add employee
router.post('/addemp',[
    body('name').notEmpty().withMessage('Name is required'),
    // body('dob').isISO8601().withMessage('Invalid date format for Date of Birth'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('cnic').notEmpty().withMessage('CNIC is required'),
    body('job_title').notEmpty().withMessage('Job title is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('date_of_hire').isISO8601().withMessage('Invalid date format for Date of Hire'),
    // body('employee_status').isIn(['Active', 'Inactive']).withMessage('Invalid employee status'),
    // body('phone_number').notEmpty().withMessage('Phone number is required'),
], async (req, res)=>{
    try {
        //destructuring
        const {name,salary, dob, gender, cnic, job_title, department, date_of_hire, employee_status, phone_number, leave_balance, employee_photo} = req.body;
        
        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const emp = new Emp({
            name,salary, dob, gender, cnic, job_title, department, date_of_hire, employee_status, phone_number, leave_balance, employee_photo
        })

        savedEmp = await emp.save();
        res.json(savedEmp)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured!");
    }

})

//Route2: get employee
router.get('/fetchallemp', async (req, res)=>{
    const emp = await Emp.find();
    res.json(emp)
})

// ROUTE3: Update employee
router.put('/updateemp/:id', async (req, res) => { 
    const { name,salary, dob, gender, cnic, job_title, department, date_of_hire, employee_status, phone_number, leave_balance, employee_photo } = req.body;

    // Create a newEmp Object
    const newEmp = {
        name,salary, dob, gender, cnic, job_title, department, date_of_hire,
        employee_status, phone_number, leave_balance, employee_photo
    };

    try {
        // Find the employee to be updated
        let emp = await Emp.find();

        if (!emp) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the authenticated user is the owner of the employee
        // if (emp.user.toString() !== req.user.id) {
        //     return res.status(403).json({ error: "Unauthorized access" });
        // }

        // Update the employee
        emp = await Emp.findByIdAndUpdate(req.params.id, { $set: newEmp }, { new: true });

        res.json({ updatedEmployee: emp });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});


// ROUTE4: delete employee
router.delete('/deleteemp/:id', async (req, res) => { 
    const { name, dob,salary, gender, cnic, job_title, department, date_of_hire, employee_status, phone_number, leave_balance, employee_photo } = req.body;

    // Create a newEmp Object
        try {
        // Find the employee to be deleted
        let emp = await Emp.find();

        if (!emp) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the authenticated user is the owner of the employee
        // if (emp.user.toString() !== req.user.id) {
        //     return res.status(403).json({ error: "Unauthorized access" });
        // }

        // Update the employee
        emp = await Emp.findByIdAndDelete(req.params.id);

        res.json({ "success": "Deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});

module.exports = router