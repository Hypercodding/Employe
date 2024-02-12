// routes/purchases.js

const express = require('express');
const router = express.Router();
const multer = require('multer'); // for handling file uploads
const Purchase = require('../models/Purchase');
const Account = require('../models/Account');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/Moham/Desktop/4nokri/backend/uploads/'); // Specify the destination folder (create 'uploads' folder in your project)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // Limit the file size to 5MB (adjust as needed)
    },
  });
  
  router.use(express.json());
  
  // Add Purchase
 // Add Purchase
router.post('/add', upload.single('receipt'), async (req, res) => {
    const { itemName, quantity, amountPerPiece, vendorName, bankName } = req.body;
  
    try {
        const TotalAmount = quantity * amountPerPiece;

      const purchase = new Purchase({
        itemName,
        quantity,
        amountPerPiece,
        TotalAmount,
        vendorName,
        bankName,
        receipt: req.file.path, // Save the file path in the 'receipt' field
      });
  
      await purchase.save();
  
      // Update the amount in the relevant bank in the 'account' table
      const account = await Account.findOne({ _id: bankName });
      if (account) {
        account.totalAmount += parseFloat(TotalAmount); // Assuming 'amount' is a numeric value
        await account.save();
        console.log(account);
      } else {
        console.error('Bank account not found');
      }
  
      res.status(201).json({ message: 'Purchase added successfully', purchase });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  });
    


router.get('/getPurchase', async (req, res)=>{
    const purchase = await Purchase.find();
      res.json(purchase)
  })


  router.get('/:purchaseId', async (req, res) => {
    try {
      const purchase = await Purchase.findById(req.params.purchaseId);
      if (!purchase) {
        res.status(404).send('Purchase not found');
        return;
      }
  
      const receiptPath = purchase.receipt;
  
      if (!receiptPath) {
        res.status(404).send('Receipt not found');
        return;
      }
  
      res.sendFile(receiptPath);
    } catch (error) {
      console.error('Error fetching receipt:', error.message);
      res.status(500).send('Internal Server Error');
    }
  });
  
  //delete
  // ROUTE4: delete purchase
router.delete('/deletePurchase/:id', async (req, res) => { 
    const {itemName, quantity, amountPerPiece, vendorName, bankName,TotalAmount } = req.body;

    // Create a newEmp Object
        try {
        // Find the employee to be deleted
        let purchase = await Purchase.find();

        if (!purchase) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Check if the authenticated user is the owner of the employee
        // if (emp.user.toString() !== req.user.id) {
        //     return res.status(403).json({ error: "Unauthorized access" });
        // }

        // Update the employee
        purchase = await Purchase.findByIdAndDelete(req.params.id);

        res.json({ "success": "Deleted" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error occurred!");
    }
});
    

module.exports = router;
