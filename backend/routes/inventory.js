const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Get all inventory items
// Get all inventory items with item details
router.get('/getInventory', async (req, res) => {
    try {
      const inventory = await Inventory.aggregate([
        {
            $lookup: {
                from: 'items', // Use the actual name of the items collection
                localField: 'item',
                foreignField: '_id',
                as: 'itemDetails',
              },
        },
        {
          $unwind: '$itemDetails',
        },
        {
          $project: {
            _id: 1,
            'itemDetails.itemName': 1,
            quantity: 1,
            // Add other fields as needed
          },
        },
      ]);
  
      res.json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

module.exports = router;
