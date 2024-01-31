const express = require('express');
const router = express.Router();
const Emp = require('../models/Emp');
const Cmp = require('../models/Cmp')
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser')
const pdf = require('html-pdf');
const fs = require('fs');

//Route1: Add employee
router.post('/addemp',[
    body('name').notEmpty().withMessage('Name is required'),
    // body('dob').isISO8601().withMessage('Invalid date format for Date of Birth'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('cnic').custom(async (value, { req }) => {
        const existingEmp = await Emp.findOne({ cnic: value });
        if (existingEmp) {
          throw new Error('CNIC must be unique');
        }
        return true;
      }),
    body('job_title').notEmpty().withMessage('Job title is required'),
    body('department').notEmpty().withMessage('Department is required'),
    body('date_of_hire').isISO8601().withMessage('Invalid date format for Date of Hire'),
    // body('employee_status').isIn(['Active', 'Inactive']).withMessage('Invalid employee status'),
    // body('phone_number').notEmpty().withMessage('Phone number is required'),
], async (req, res)=>{
    try {
        //destructuring
        const {name,salary, dob, gender, cnic, job_title, department, date_of_hire, employee_status, phone_number, leave_balance, employee_photo,cmpName} = req.body;
        
        
        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        const cmp = await Cmp.findOne({ name: cmpName });
        if (!cmp) {
            return res.json({ success: false, message: 'Company not found' });
          }

        const emp = new Emp({
            name,salary, dob, gender, cnic, job_title, department, date_of_hire, employee_status, phone_number, leave_balance, employee_photo, cmp: cmp._id
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
    const emp = await Emp.find().populate('cmp', 'name');
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



  // Endpoint to fetch specific user data by CNIC from request body and send as PDF
router.post('/getEmpByCnicAsPdf', [
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
      const emp = await Emp.findOne({ cnic });
  
      if (!emp) {
        return res.status(404).json({ message: 'Employee not found for the provided CNIC' });
      }
  
      // Generate PDF content (replace this with your HTML content)
      const htmlContent = `
        <div style="text-align: center;">
<h1>Errors and Omissions are accepted</h1>
        <table  style="width:100%;border: 1px solid black">
  <tr>
      <th colspan="4" style="border: 1px solid black">SALARY SLIP</th>
  </tr>
  <tr>
    <td style="border: 1px solid black"><b>Name</b></td>
    <td style="border: 1px solid black">${emp.name}</td>
    <td style="border: 1px solid black"><b>Date</b></td>
    <td style="border: 1px solid black">${new Date().toLocaleDateString('en-GB')}</td>
  </tr>
  <tr>
    <td style="border: 1px solid black"><b>CNIC</b></td>
    <td style="border: 1px solid black">${emp.cnic}</td>
    <td style="border: 1px solid black"><b>Number</b></td>
    <td style="border: 1px solid black">${emp.phone_number}</td>
  </tr>
  <tr>
    <td style="border: 1px solid black"><b>Company</b></td>
    <td style="border: 1px solid black">${emp.cmp.name}</td>
    <td style="border: 1px solid black"><b>Designation</b></td>
    <td style="border: 1px solid black">${emp.job_title}</td>
  </tr>
  <tr>
    <td style="border: 1px solid black"><b>Net Salary</b></td>
    <td style="border: 1px solid black">${emp.salary}</td>
    <td style="border: 1px solid black"><b>leaves</b></td>
    <td style="border: 1px solid black">${emp.leave_balance - 4}</td>
  </tr>
  <tr>
    <td style="border: 1px solid black"></td>
    <td style="border: 1px solid black"></td>
    <td style="border: 1px solid black"><b>Payable</b></td>
    <td style="border: 1px solid black">${emp.leave_balance > 4 ? emp.salary - (emp.leave_balance * 10) : emp.salary}</td>
  </tr>
</table>
<h3 style="margin-top: 150px;text-align:right;">Sign:_________________</h3>
      </div>
      `;
  
      // Options for the PDF generation
      const pdfOptions = { format: 'Letter' };
  
      // Generate PDF
      pdf.create(htmlContent, pdfOptions).toFile((err, filePath) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error generating PDF');
        }
  
        // Send the PDF file to the client
        res.download(filePath.filename, 'employee_data.pdf', (downloadErr) => {
          if (downloadErr) {
            console.error(downloadErr);
            res.status(500).send('Error sending PDF to client');
          }
  
          // Delete the temporary PDF file after sending
          fs.unlinkSync(filePath.filename);
        });
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Some error occurred!');
    }
  });
  
  // ... (other routes and

module.exports = router