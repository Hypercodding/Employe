const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');



const JWT_secret = 'Usman';

//Route1: CREATE COMPANY

router.get('/getCmp', async (req, res) => {
    try {
        const companiesWithEmployeeCount = await Company.aggregate([
            {
                $lookup: {
                    from: 'employees',
                    localField: '_id',
                    foreignField: 'company',
                    as: 'employees'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'manager',
                    foreignField: '_id',
                    as: 'managerDetails'
                }
            },
            {
                $project: {
                    name: 1,
                    companyStatus: 1,
                    manager: {
                        _id: '$manager',
                        firstName: { $arrayElemAt: ['$managerDetails.firstName', 0] },
                        lastName: { $arrayElemAt: ['$managerDetails.lastName', 0] }
                    },
                    employeeCount: { $size: '$employees' }
                }
            }
        ]);

        res.json(companiesWithEmployeeCount);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

///
router.get('/', fetchuser,async (req, res) => {
    try {
        const companies = await Company.find({companyStatus: 'Active'}, 'name _id'); // Assuming your Company model has 'name' and '_id' fields
        res.json(companies);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Endpoint to create a new company
router.post('/create',fetchuser, async (req, res) => {
    try {
      const { name, companyStatus, managerId } = req.body;
  
      // Find the manager in the User collection
      const manager = await User.findById(managerId);
      
      // Check if the manager exists
      if (!manager) {
        return res.json({ success: false, message: 'Manager not found' });
      }

      // Create a new company with the manager
      const newCompany = new Company({
        name,
        companyStatus,
        manager: manager._id, // Set the manager field with the manager's ObjectId
      });
  
      // Save the new company to the database
      const savedCompany = await newCompany.save();
  
      res.json(savedCompany);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
});

router.delete('/deleteCompany/:id', async (req, res) => { 
        try {
        // Find the Company to be deleted
        let company = await Company.find();

        if (!company) {
            return res.status(404).json({ error: "Employee not found" });
        }

     
        company = await Company.findByIdAndDelete(req.params.id);

        res.json({ "success": "Deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});

// ROUTE3: Update employee
router.put('/updateCompany/:id', async (req, res) => { 
    const { name,managerId,companyStatus } = req.body;

    // Create a newEmp Object
    const newCompany = { companyStatus };

    try {
        // Find the employee to be updated
        let company = await Company.find();

        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }

     
        // Update the compnay
        company = await Company.findByIdAndUpdate(req.params.id, { $set: newCompany }, { new: true });

        res.json({ updatedCompany: company });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});




module.exports = router;
