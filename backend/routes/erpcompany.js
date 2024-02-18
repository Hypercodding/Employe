const express = require('express');
const router = express.Router();
const ErpCompany = require('../models/ERPCompany');

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');



const JWT_secret = 'Usman';


router.post('/create', async (req, res) => {
    try {
      const { name } = req.body;
  
     
      // Create a new company with the manager
      const newErpCompany = new ErpCompany({
        name
      });
  
      // Save the new company to the database
      const savedErpCompany = await newErpCompany.save();
  
      res.json(savedErpCompany);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
});


module.exports = router;