const express = require('express');
const router = express.Router();
const Cmp = require('../models/Cmp');
const Items = require('../models/Items')
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');


const JWT_secret = 'Usman';

router.post('/addItem', async (req, res) => {
    try {
        // Destructuring
        const { itemName, itemQuantity, vendor, amount } = req.body;

        // Check if the item already exists
        const item = await Items.findOne({ itemName: itemName.toLowerCase() });
        if (item) {
            return res.json({ success: false, message: 'Item already exists' });
        }

        // Create a new instance of Items model
        const newItem = new Items({
            itemName: itemName.toLowerCase(),
            itemQuantity: itemQuantity,
            vendor: vendor,
            amount: amount
        });

        // Save the new item to the database
        const savedItem = await newItem.save();

        res.json(savedItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});



//ROUTE 2: GET ITEMS
router.get('/getItems', async(req, res)=>{
    const item = await Items.find();
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