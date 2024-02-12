const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Create loan
router.post('/', async (req, res) => {
  try {
    const { employeeId, amount, durationMonths } = req.body;

    const newLoan = new Loan({
      employeeId,
      amount,
      durationMonths,
    });

    const savedLoan = await newLoan.save();

    res.json(savedLoan);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get all leaves with employee names using $lookup
router.get('/loan', async (req, res) => {
  try {
    const loan = await Loan.aggregate([
      {
        $lookup: {
          from: 'employees', // The name of the collection to join with
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employeeData',
        },
      },
      {
        $unwind: '$employeeData',
      },
      {
        $project: {
          _id: 1,
          amount: 1,
          durationMonths: 1,
          remainingAmount: 1,
          employeeName: '$employeeData.name',
          employeeCnic: '$employeeData.cnic',
           // Extract the name from the joined collection
        },
      },
    ]);

    res.json(loan);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get loans for an employee
router.get('/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;

    const loans = await Loan.find({ employeeId });

    res.json(loans);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Update loan
router.put('/:loanId', async (req, res) => {
  try {
    const loanId = req.params.loanId;
    const { amount, durationMonths } = req.body;

    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { amount, durationMonths },
      { new: true }
    );

    res.json(updatedLoan);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Delete loan
router.delete('/:loanId', async (req, res) => {
  try {
    const loanId = req.params.loanId;

    await Loan.findByIdAndDelete(loanId);

    res.json({ message: 'Loan deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
