const express = require('express');
const router = express.Router();
const Cmp = require('../models/Cmp');
const Items = require('../models/Items')
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_secret = 'Usman';

//Route1: Add employee
router.post('/addItem', async (req, res)=>{
    try {
        //destructuring
        const {itemName,itemQuantity,vendor, cmpName} = req.body;
        
        
       
        const cmp = await Cmp.findOne({ name: cmpName });
        if (!cmp) {
            return res.json({ success: false, message: 'Company not found' });
          }

        const items = new Items({
            itemName,itemQuantity,vendor, cmp: cmp._id
        })

        savedItems = await items.save();
        
        res.json(savedItems)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error occured!");
    }

})

//ROUTE 2: GET ITEMS
router.get('/getItems', async(req, res)=>{
    const item = await Items.find().populate('cmp', 'name');
    res.json(item)
})


//ROUTE3: UPDATE ITEM
router.put('/updateItem/:id', async (req, res) => {
    const { itemName, itemQuantity } = req.body;
    const newItem = {
        itemName,
        itemQuantity
    };

    try {
        // Find the item by ID
        const item = await Items.findById(req.params.id);

        // Check if the item exists
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        // Check if the new item name already exists
        if (itemName !== item.itemName) {
            const existingItem = await Items.findOne({ itemName });
            if (existingItem) {
                return res.status(400).json({ error: "Item with the provided name already exists" });
            }
        }

        // Update the item
        const updatedItem = await Items.findByIdAndUpdate(
            req.params.id,
            { $set: newItem },
            { new: true }
        );

        res.json({ updatedItem });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});

module.exports = router;