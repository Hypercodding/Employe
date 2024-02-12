const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Create leave
router.post('/', async (req, res) => {
  try {
    const { employeeId, days, month, isDeducted } = req.body;

    const newLeave = new Leave({
      employeeId,
      days,
      month,
      year: new Date().getFullYear(),
      isDeducted,
    });

    const savedLeave = await newLeave.save();

    res.json(savedLeave);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get all leaves with employee names using $lookup
router.get('/leaves', async (req, res) => {
  try {
    const leaves = await Leave.aggregate([
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
          days: 1,
          month: 1,
          isDeducted: 1,
          year: 1,
          employeeName: '$employeeData.name',
          employeeCnic: '$employeeData.cnic',
           // Extract the name from the joined collection
        },
      },
    ]);

    res.json(leaves);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});
// Get leaves for an employee for a specific month
router.get('/:employeeId/:month', async (req, res) => {
  try {
    const { employeeId, month } = req.params;

    const leaves = await Leave.find({ employeeId, month });

    res.json(leaves);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Update leave
router.put('/updateLeave/:leaveId', async (req, res) => {
  try {
    const leaveId = req.params.leaveId;
    const { days } = req.body;

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { days },
      { new: true }
    );

    res.json(updatedLeave);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Delete leave
router.delete('/deleteLeave/:leaveId', async (req, res) => {
  try {
    const leaveId = req.params.leaveId;

    await Leave.findByIdAndDelete(leaveId);

    res.json({ message: 'Leave deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
