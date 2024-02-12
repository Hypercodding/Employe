// routes/accounts.js

const express = require('express');
const router = express.Router();
const Account = require('../models/Account');

// Add Account
router.post('/add', async (req, res) => {
    const { bankName } = req.body;

    try {
        let account = await Account.findOne({ bankName });

        if (account) {
            return res.status(400).json({ message: 'Account already exists for this bank' });
        }

        account = new Account({ bankName });
        await account.save();

        res.status(201).json({ message: 'Account added successfully', account });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/getAccount', async (req, res)=>{
    const account = await Account.find();
      res.json(account)
  })



//just name
router.get('/AccountName', async (req, res) => {
    try {
        const account = await Account.find({}, 'bankName _id'); // Assuming your Company model has 'name' and '_id' fields
        res.json(account);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
  });
module.exports = router;
