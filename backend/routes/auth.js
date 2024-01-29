const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser')

//token pass
const JWT_secret = 'Usman';



// ROUTE: CREATE USER
router.post('/createUser',[
    body('name', 'Enter valid Name').isLength({ min: 3 }),
    body('password', 'Enter Valid Password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'g')
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('ph', 'Enter Valid Phone Number').isLength({ min: 10 }),
],async (req, res)=>{

    //handle validation Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    //check if user exist with this number
    let user = await User.findOne({ph: req.body.ph});

    if(user){
        return res.status(400).json({error: "Phone Number already "})
    }

    //password hashing
    const salt= await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password, salt);
    // create a user
    user = await User.create({
        name: req.body.name,
        password: secPass,
        ph: req.body.ph,
        isAdmin: req.body.isAdmin,
    })
    //id
    const data = {
        user: {
            id: user.id
        }
    }

    const authData = jwt.sign(data, JWT_secret);

      res.json({authData})
})


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
        body('ph', 'Enter Valid Phone Number').isLength({ min: 10 }),
    ],async (req, res)=>{

         //handle validation Error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {ph, password} = req.body;
    try {
        let user = await User.findOne({ph});
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
                name: user.name,
                isAdmin: user.isAdmin
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