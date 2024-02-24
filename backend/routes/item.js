const express = require('express');
const router = express.Router();
const ErpCompany = require('../models/ERPCompany');
const Item =  require('../models/Item')
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');



const JWT_secret = 'Usman';


router.post('/add',async(req, res)=> {
    try {
        const {itemName, itemNo} = req.body;
        //add
        const newItem = new Item({itemName,itemNo});
        const savedItem = await newItem.save();
        res.json(savedItem);
    } catch (error) {
        console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
})

//get
router.get('/getItem', async (req, res)=>{
    try {
        const item = await Item.find();
        res.json(item);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

//delete
router.delete('/deleteItem/:itemId', async (req, res) => {
    try {
      const itemId = req.params.itemId;
  
      await Item.findByIdAndDelete(itemId);
  
      res.json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });

  //update
  router.put('/updateItem/:itemId', async (req, res) => {
    try {
      const itemId = req.params.itemId;
      const { itemName,itemNo } = req.body;
  
      const updatedItem = await Item.findByIdAndUpdate(
        itemId,
        {$set: {itemName,itemNo }},
        { new: true }
      );
  
      res.json(updatedItem);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });


  //get item names and id
  
router.get('/itemName', async (req, res) => {
  try {
    const items = await Item.find({}, 'itemName itemNo _id');
    res.json(items);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});
module.exports = router;