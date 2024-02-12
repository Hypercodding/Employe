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
        const {name,salary, dateOfBirth, gender, cnic, designation, dateOfHiring, employeeStatus, phoneNumber, cmpId} = req.body;
        
        
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
          name,salary, dateOfBirth, gender, cnic, designation, dateOfHiring, employeeStatus, phoneNumber, company: company._id
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



  // Endpoint to fetch specific user data by CNIC from request body and send as PDF
// Endpoint to fetch specific user data by employee ID from request params and send as PDF
router.post('/getEmpByEmployeeIdAsPdf/:employeeId', async (req, res) => {
  try {
    // Retrieve user data based on employee ID from request params
    const { employeeId } = req.params;
    const emp = await Salary.findOne({ employee: employeeId });

    if (!emp) {
      return res.status(404).json({ message: 'Employee not found for the provided ID' });
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
    <td style="border: 1px solid black">${emp.phoneNumber}</td>
  </tr>
  <tr>
    <td style="border: 1px solid black"><b>Company</b></td>
    <td style="border: 1px solid black">${emp.cmp.name}</td>
    <td style="border: 1px solid black"><b>Designation</b></td>
    <td style="border: 1px solid black">${emp.designation}</td>
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
      res.download(filePath.filename, 'employee_salary_slip.pdf', (downloadErr) => {
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


router.get('/employeeLeaveInfo', async (req, res) => {
  try {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    console.log('Current Month:', currentMonth, 'Current Year:', currentYear);

    const employeeLeaveInfo = await Employee.aggregate([
      {
        $lookup: {
          from: 'leaves',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'leaveDetails',
        },
      },
      {
        $unwind: {
          path: '$leaveDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          employeeName: '$name',
          leaveDays: {
            $ifNull: [
              {
                $cond: {
                  if: { $eq: ['$leaveDetails.month', currentMonth] },
                  then: '$leaveDetails.days',
                  else: null,
                },
              },
              null,
            ],
          },
        },
      },
    ]);

    console.log('Employee Leave Info:', employeeLeaveInfo);

    res.json(employeeLeaveInfo);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});  
  // ... (other routes and

module.exports = router