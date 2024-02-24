const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Product = require('../models/Product');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const PDFDocument = require('pdfkit');
const fs = require('fs');




router.post('/', async (req, res) => {
  try {
    const { productName, items } = req.body;

      // Validate if the items exist
      const itemIds = items.map((item) => item.item);
      const existingItems = await Item.find({ _id: { $in: itemIds } });
  

    if (existingItems.length !== itemIds.length) {
      return res.status(400).json({ error: 'One or more items do not exist' });
    }

    // Create a new product
    const newProduct = new Product({ productName, items });

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/products
router.get('/get', async (req, res) => {
  try {
    // Retrieve all products from the database and populate the item details
    const products = await Product.find().populate('items.item', 'itemName');

    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting products:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route 1: Add product
router.post(
  '/addProduct',
  [
    body('productName', 'Product name is required').notEmpty(),
    body('productQuantity', 'Product quantity is required').isInt(),
    body('customer', 'Customer name is required').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productName, productQuantity, customer } = req.body;

    try {
      const newProduct = new Product({
        productName: productName.toUpperCase(),
        productQuantity,
        customer,
      });

      // Calculate total amount based on product type
      let totalAmount = 0;
      switch (productName.toUpperCase()) {
        case 'PC':
          totalAmount = 800 * productQuantity;
          break;
        case 'TV':
          totalAmount = 1000 * productQuantity;
          break;
        // Add more cases for other product types if needed
        default:
          break;
      }

      // Assign total amount to the new product
      newProduct.amount = totalAmount;

      await newProduct.save();

      switch (productName.toUpperCase()) {
        case 'PC':
          await reduceItemQuantity('keyboard', 1 * productQuantity);
          await reduceItemQuantity('mouse', 1 * productQuantity);
          break;
        case 'TV':
          await reduceItemQuantity('lcd', 1 * productQuantity);
          break;
        default:
          break;
      }

      res.status(201).json({ message: 'Product created successfully', totalAmount });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Some error occurred!' });
    }
  }
);


// Route 2: Get items
router.get('/getProduct', async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Some error occurred!' });
  }
});

async function reduceItemQuantity(itemName, quantityToReduce) {
  try {
    const itemToUpdate = await Items.findOne({ itemName });
    if (itemToUpdate) {
      itemToUpdate.itemQuantity -= quantityToReduce;
      await itemToUpdate.save();
    }
  } catch (error) {
    console.error(`Error reducing item quantity for ${itemName}: ${error.message}`);
  }
}

router.post('/generateOutpassPDF/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    // Fetch the item based on the productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Create a PDF document
    const doc = new PDFDocument();
    // Customize the PDF content based on your requirements
    doc.fontSize(16).text(`Outpass for product: ${product.productName}`, 100, 100);
    doc.fontSize(12).text(`Product ID: ${product._id}`, 100, 130);
    doc.fontSize(12).text(`Product Customer: ${product.customer}`, 100, 160);
    doc.fontSize(12).text(`Amount: ${product.amount}`, 150, 190);
    // Add more details as needed

    // Finalize the PDF and set headers for download
    res.setHeader('Content-Disposition', `attachment; filename=outpass_${product._id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the PDF to the response
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Some error occurred while generating outpass PDF' });
  }
});





module.exports = router;
