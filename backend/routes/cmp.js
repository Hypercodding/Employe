const express = require('express');
const router = express.Router();
const Cmp = require('../models/Cmp');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_secret = 'Usman';

//Route1: CREATE COMPANY
router.post('/addCmp',async(req, res)=>{
    try {
        const{name, owner} = req.body;

        const cmp = new Cmp({
            name, owner
        })

        savedCmp = await cmp.save();
        res.json(savedCmp)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("not able to create a Comopany");
    }
})


//ROUTE 2: GETTING DATA
router.get('/getCmp', async(req, res)=>{
    try {
        const cmp = await Cmp.find();
        res.json(cmp);
    } catch (error) {
        
    }
})
module.exports = router;