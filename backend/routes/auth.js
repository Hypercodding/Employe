const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')
const Company = require('../models/Company')
const ErpCompany = require('../models/ERPCompany')
const bodyParser = require('body-parser');
const twilio = require('twilio');

//token pass
const JWT_secret = 'Usman';


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
            ErpCompany: company._id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: secPass,
            phoneNumber: `+${req.body.phoneNumber}`,
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

        // Generate JWT token
        const data = {
            user: {
                
                firstName: user.firstName,
                role: user.role,
                Erpcompany_id: user.ErpCompany 
                
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
    let { phoneNumber, password } = req.body;

    // Add a "+" sign to the beginning of the phone number
    phoneNumber = `+${phoneNumber}`;

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
                firstName: user.firstName,
                role: user.role,
                Erpcompany_id: user.ErpCompany 
            }
        }
    
        const authData = jwt.sign(data, JWT_secret);
    
          res.json({authData})
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured!");
        
    }

    })

    // Twilio configuration
const accountSid = 'AC14a099aef0808b378336eaf1d5a1628c';
const authToken = '33ab51c00064829a0c7579fb98ab04ae';
const client = new twilio(accountSid, authToken);

   
router.post('/send-verification-code', async (req, res) => {
    const { mobileNumber } = req.body;

    try {
        const user = await User.findOne({ phoneNumber: `+${mobileNumber}` });
        if (!user) {
            return res.status(400).json({ error: 'Mobile number is not registered' });
        }

        // Generate a random verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Update the user document with the verification code
        user.verificationCode = verificationCode;
        await user.save();

        // Send the verification code via Twilio SMS
        await client.messages.create({
            body: `Your verification code is: ${verificationCode}, I love you so much Ahmad Raza from Gujranwala`,
            from: '+1 937 871 3039',
            to: `+${mobileNumber}`,
        });

        console.log(`Verification code for ${mobileNumber}: ${verificationCode}`);
        res.json({ message: 'Verification code sent successfully' });
    } catch (error) {
        console.error('Twilio error:', error.message);
        res.status(500).json({ error: 'Failed to send verification code' });
    }
});


//verify code

router.post('/verify-code-reset-password', async (req, res) => {
    const { mobileNumber, verificationCode, newPassword } = req.body;

    try {
        // Find the user by mobile number and verify the code
        const user = await User.findOne({ phoneNumber: `+${mobileNumber}`, verificationCode });

        if (!user) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Reset the user's password

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(newPassword, salt);
        
        user.password = secPass;
        user.verificationCode = null; // Clear the verification code after use
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Password reset error:', error.message);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

module.exports = router;

module.exports =router;