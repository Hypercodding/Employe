const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// Create leave
router.post('/', async (req, res) => {
  try {
    const { employeeId, startDate, endDate, isDeducted } = req.body;

    // Convert startDate and endDate to Date objects
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Calculate the difference in milliseconds between startDate and endDate
    const daysDifference = endDateObj.getTime() - startDateObj.getTime();

    // Convert milliseconds to days and round to the nearest whole number
    const days = Math.round((daysDifference / (1000 * 60 * 60 * 24))+1);

    const newLeave = new Leave({
      employeeId,
      startDate,
      endDate,
      days,
      month: startDateObj.getMonth() + 1,  // Adding 1 since getMonth() returns 0-based index
      year: startDateObj.getFullYear(),
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
          startDate: 1,
          endDate: 1,
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
    const { startDate, endDate } = req.body;

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Calculate the difference in milliseconds between startDate and endDate
    const daysDifference = endDateObj.getTime() - startDateObj.getTime();

    // Convert milliseconds to days and round to the nearest whole number
    const days = Math.round((daysDifference / (1000 * 60 * 60 * 24))+1);

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      {$set: { startDate, endDate,days,month: startDateObj.getMonth() + 1,  // Adding 1 since getMonth() returns 0-based index
      year: startDateObj.getFullYear() }},
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
