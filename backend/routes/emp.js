const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Company = require('../models/Company')
const Leave = require('../models/Leave')
const User = require('../models/User')

const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const pdf = require('html-pdf');
const fs = require('fs');
const Salary = require('../models/Salary');

//Route1: Add employee
router.post('/addemployee',[
    body('name').notEmpty().withMessage('Name is required'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('cnic').custom(async (value, { req }) => {
        const existingEmployee = await Employee.findOne({ cnic: value });
        if (existingEmployee) {
          throw new Error('CNIC must be unique');
        }
        return true;
      }),
    body('designation').notEmpty().withMessage('Job title is required'),
    // body('department').notEmpty().withMessage('Department is required'),
    body('dateOfHiring').isISO8601().withMessage('Invalid date format for Date of Hire'),
    // body('employeeStatus').isIn(['Active', 'Inactive']).withMessage('Invalid employee status'),
    // body('phoneNumber').notEmpty().withMessage('Phone number is required'),
], async (req, res)=>{
    try {
        //destructuring
        const {name,salary,overTime, dateOfBirth, gender, cnic, designation, dateOfHiring, employeeStatus, phoneNumber, cmpId} = req.body;
        
        
        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const company = await Company.findById(cmpId);
        if (!company) {
            return res.json({ success: false, message: 'Company not found' });
          }

        const employee = new Employee({
          name,salary,overTime, dateOfBirth, gender, cnic, designation, dateOfHiring, employeeStatus, phoneNumber, company: company._id
        })

        const savedEmployee = await employee.save();
        
        res.json(savedEmployee)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured!");
    }

})

router.get('/empplyeeName', async (req, res) => {
  try {
      const employee = await Employee.find({employeeStatus: 'Active'}, 'name designation _id'); // Assuming your Company model has 'name' and '_id' fields
      res.json(employee);
  } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
  }
});
//Route2: get employee
router.get('/fetchallemp', async (req, res)=>{
  const employees = await Employee.find()
  .populate('company', 'name');
    res.json(employees)
})

// ROUTE3: Update employee
router.put('/updateemp/:id', async (req, res) => { 
    const { name,salary, dateOfBirth, gender, cnic, designation, dateOfHiring, employeeStatus, phoneNumber } = req.body;

    // Create a newEmp Object
    const newEmployee = {
        name,salary, dateOfBirth, gender, cnic, designation, dateOfHiring,
        employeeStatus, phoneNumber
    };

    try {
        // Find the employee to be updated
        let employee = await Employee.find();

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the authenticated user is the owner of the employee
        // if (emp.user.toString() !== req.user.id) {
        //     return res.status(403).json({ error: "Unauthorized access" });
        // }

        // Update the employee
        employee = await Employee.findByIdAndUpdate(req.params.id, { $set: newEmployee }, { new: true });

        res.json({ updatedEmployee: employee });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});


// ROUTE4: delete employee
router.delete('/deleteemp/:id', async (req, res) => { 
    const { name, dateOfBirth,salary, gender, cnic, designation, department, dateOfHiring, employeeStatus, phoneNumber, leave_balance, employee_photo } = req.body;

    // Create a newEmp Object
        try {
        // Find the employee to be deleted
        let employee = await Employee.find();

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

     
        employee = await Employee.findByIdAndDelete(req.params.id);

        res.json({ "success": "Deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});


// Endpoint to fetch specific user data by CNIC from request body
router.post('/getEmpByCnic', [
    // CNIC in the request body validation
    body('cnic').notEmpty().withMessage('CNIC is required'),
  
    // ... (add more validation rules as needed)
  ], async (req, res) => {
    try {
      // Validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Retrieve user data based on CNIC from request body
      const { cnic } = req.body;
      const emp = await Emp.findOne({ cnic }).populate('cmp', 'name');;
  
      if (!emp) {
        return res.status(404).json({ message: 'Employee not found for the provided CNIC' });
      }
  
      res.json(emp);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occurred!');
    }
  });
  router.get('/employeeSalaryInfo', async (req, res) => {
    try {
      const today = new Date();
      const currentMonth = today.getMonth() + 1;
  
      const employeeSalaryInfo = await Employee.aggregate([
        {
          $lookup: {
            from: 'leaves',
            localField: '_id',
            foreignField: 'employeeId',
            as: 'leaveDetails',
          },
        },
        {
          $lookup: {
            from: 'loans',
            localField: '_id',
            foreignField: 'employeeId',
            as: 'loanDetails',
          },
        },
        {
          $lookup: {
            from: 'salary',
            localField: '_id',
            foreignField: 'employeeId',
            as: 'salaryDetails',
          },
        },
        // Add more lookups for other salary components (e.g., final salary, base salary)
  
        // Unwind leaveDetails and loanDetails arrays
        {
          $unwind: {
            path: '$leaveDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$salaryDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: '$loanDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        // Add more $unwind stages for other salary components
  
        // Group by employeeId and calculate total leave days
        {
          $group: {
            _id: '$_id',
            employeeName: { $first: '$name' },
            salary: { $first: '$salary' },
            finalSalary: { $first: '$salaryDetails.finalSalary' },
            leaveDays: { $sum: '$leaveDetails.days' },
            totalLoans: { $sum: '$loanDetails.amount' },
            // Add more fields for other salary components
          },
        },
        // Optionally, add a $project stage to customize the output
  
        // Add more stages for other salary components
  
        // Project the desired fields for the response
        {
          $project: {
            _id: 1,
            employeeName: 1,
            leaveDays: 1,
            totalLoans: 1,
            salary: 1,
            finalSalary: 1,
            // Add more fields for other salary components
          },
        },
      ]);
  
      res.json(employeeSalaryInfo);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
//Route:


module.exports = router