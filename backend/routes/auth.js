const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const Company = require('../models/Company')

//token pass
const JWT_secret = 'Usman';



// ROUTE: CREATE USER
// ROUTE: CREATE USER
router.post('/createUser', [
    // ... (your existing validation code)
], async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Find or create the company with the provided name
        let company = await Company.findOne({ name: req.body.companyName });

        if (!company) {
            company = new Company({
                name: req.body.companyName,
                companyStatus: 'Active', // Set the company status to 'Active' by default
            });
        }

        // Password hashing
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create a user
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: secPass,
            phoneNumber: req.body.phoneNumber,
            role: req.body.role,
        });

        // Set the company and user references
        user.company = company._id;

        // If the user is a manager, set the user as the company's manager
        if (req.body.role === 'Manager') {
            company.manager = user._id;
        }

        // Update the company's users field
        company.users.push(user._id);

        // Save the user and update the company
        await user.save();
        await company.save();

        // Populate the manager field with user's information
        // company = await Company.findById(company._id).populate('manager', 'firstName lastName');

        // Generate JWT token
        const data = {
            user: {
                id: user.id
            }
        };

        const authData = jwt.sign(data, JWT_secret);

        res.json({ authData, company });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Some error occurred!');
    }
})

router.get('/userName', async (req, res) => {
    try {
        const company = await User.find({role: 'Manager'}, 'firstName lastName  _id'); // Assuming your Company model has 'name' and '_id' fields
        res.json(company);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
  });


//ROUTE GET USER
router.get('/getUser',fetchuser, async (req, res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured!");
    }
    })

    //Route3:fetch
    router.post('/login',[
        body('password', 'Enter Valid Password').exists(),
        body('phoneNumber', 'Enter Valid Phone Number').isLength({ min: 10 }),
    ],async (req, res)=>{

         //handle validation Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {phoneNumber, password} = req.body;
    try {
        let user = await User.findOne({phoneNumber});
        if(!user){
            return res.status(400).json({error: "Please Enter th correct credentials!"});
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error: "Please Enter th correct credentials!"});
        }

        const data = {
            user: {
                id: user.id,
                firstName: user.firstName,
                role: user.role
            }
        }
    
        const authData = jwt.sign(data, JWT_secret);
    
          res.json({authData})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured!");
        
    }

    })


module.exports =router;