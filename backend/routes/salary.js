const express = require('express');
const router = express.Router();
const Salary = require('../models/Salary');
const Leaves = require('../models/Leave');
const Loans = require('../models/Loan');
const Employee = require('../models/Employee')
const { format, parseISO, getMonth } = require('date-fns');
const pdf = require('html-pdf');
const fs = require('fs');


//pdf
router.post('/getAsPdf/:salaryId', async (req, res) => {
  try {
    const { salaryId } = req.params;
    const salary = await Salary.findById(salaryId);

    if (!salary) {
      return res.status(404).json({ message: 'Salary not found for the provided ID' });
    }

      const employee = await Employee.findById( salary.employeeId ).sort({ _id: -1 });
      const leaves = await Leaves.findOne({ employeeId: salary.employeeId }).sort({ _id: -1 });
const loans = await Loans.findOne({ employeeId: salary.employeeId }).sort({ _id: -1 });

    const htmlContent = `
    <div style="text-align: center;">
  <h1>Errors and Omissions are accepted</h1>
  <table style="width:100%;border: 1px solid black">
    <tr>
      <th colspan="4" style="border: 1px solid black">SALARY SLIP</th>
    </tr>
    <tr>
      <td style="border: 1px solid black"><b>Name</b></td>
      <td style="border: 1px solid black">${employee.name}</td>
      <td style="border: 1px solid black"><b>Date</b></td>
      <td style="border: 1px solid black">${new Date().toLocaleDateString('en-GB')}</td>
    </tr>
    <tr>
      <td style="border: 1px solid black"><b>CNIC</b></td>
      <td style="border: 1px solid black">${employee.cnic}</td>
      <td style="border: 1px solid black"><b>Employee ID</b></td>
      <td style="border: 1px solid black">${salary.employeeId}</td>
    </tr>
    <tr>
      <td style="border: 1px solid black"><b>Basic Salary</b></td>
      <td style="border: 1px solid black">${employee.salary}</td>
      <td style="border: 1px solid black"><b>Allowances</b></td>
      <td style="border: 1px solid black">${salary.deductedLeaves}</td>
    </tr>
    
      <tr>
        <td style="border: 1px solid black"><b>Leaves</b></td>
        <td style="border: 1px solid black">${salary.deductedLeaves}</td>
        <td style="border: 1px solid black"><b>Leaves Deductions</b></td>
        <td style="border: 1px solid black">${salary.deductLeaves === true ? salary.deductedLeaves * 100: 0}</td>
      </tr>
      <!-- Check if loans is not null before displaying the rows -->
      ${loans && loans.amount !== null ? `
        <tr>
          <td style="border: 1px solid black"><b>Loan Amount</b></td>
          <td style="border: 1px solid black">${loans.amount}</td>
          <td style="border: 1px solid black"><b>Loan Duration</b></td>
          <td style="border: 1px solid black">${loans.durationMonths}</td>
          
        </tr>
        <tr>
        <td style="border: 1px solid black"><b>Remaining amount</b></td>
          <td style="border: 1px solid black">${loans.remainingAmount}</td>
          <td style="border: 1px solid black"><b>Loan Deduction</b></td>
          <td style="border: 1px solid black">${loans.amount/loans.durationMonths}</td>
        </tr>
        ` : ''}
      
      
      <tr>
      <td style="border: 1px solid black"><b></b></td>
      <td style="border: 1px solid black"></td>
      <td style="border: 1px solid black"><b>Final Salary</b></td>
      <td style="border: 1px solid black">${salary.finalSalary}</td>
    </tr>
  </table>
  <h3 style="margin-top: 150px;text-align:right;">Sign:_________________</h3>
</div>

    `;

    const pdfOptions = { format: 'Letter' };

    pdf.create(htmlContent, pdfOptions).toStream((err, stream) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error generating PDF');
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=SalarySlip_${Salary.employeeId}.pdf`);

      stream.pipe(res);
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({message: '<h1>Some error occurred!</h1>'});
  }
});


//collective

router.post('/generateCollectivePDF', async (req, res) => {
  try {
    const { employeeIds } = req.body;

    // Fetch salary data for the provided employeeIds
    const salaries = await Salary.find({ employeeId: { $in: employeeIds } });

    if (!salaries || salaries.length === 0) {
      return res.status(404).json({ message: 'No salary data found for the provided employeeIds' });
    }

    // Create an array to store individual PDF streams
    const pdfStreams = [];

    // Iterate over each salary to generate individual PDFs
    for (const salary of salaries) {
      const employee = await Employee.findById(salary.employeeId);
      const leaves = await Leaves.findOne({ employeeId: salary.employeeId }).sort({ _id: -1 });
      const loans = await Loans.findOne({ employeeId: salary.employeeId }).sort({ _id: -1 });

      // HTML content for the salary slip
      const htmlContent = `
        <!-- Your HTML content here (similar to the one used for individual PDFs) -->
      `;

      // PDF options
      const pdfOptions = { format: 'Letter' };

      // Convert HTML to PDF stream
      const pdfStream = new Promise((resolve, reject) => {
        pdf.create(htmlContent, pdfOptions).toStream((err, stream) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(stream);
          }
        });
      });

      pdfStreams.push(pdfStream);
    }

    // Wait for all PDF streams to resolve
    const pdfBuffers = await Promise.all(pdfStreams);

    // Merge individual PDF streams into a single PDF
    const mergedPdf = mergePdfStreams(pdfBuffers);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=CollectiveSalarySlips.pdf');

    // Pipe the merged PDF stream to the response
    mergedPdf.pipe(res);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Some error occurred!');
  }
});

// Function to merge multiple PDF streams into a single PDF
function mergePdfStreams(pdfStreams) {
  const { PDFMerger } = require('pdf-merger-js');

  const merger = new PDFMerger();

  for (const pdfStream of pdfStreams) {
    merger.add(pdfStream);
  }

  return merger.save();
}

// Get all salaries
router.get('/', async (req, res) => {
  try {
    const salary = await Salary.aggregate([
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
          baseSalary: '$employeeData.salary',
          deductLeaves: 1,
          deductedLeaves: 1,
          totalLoanAmount: 1,
          finalSalary: 1,
          createdAt: 1,
          employeeId: '$employeeData._id',
          employeeName: '$employeeData.name',
          employeeCnic: '$employeeData.cnic',
           // Extract the name from the joined collection
        },
      },
    ]);

    res.json(salary);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Get salary by employeeId
router.get('/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const salary = await Salary.findOne({ employeeId });
    res.json(salary);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


router.post('/create-multiple', async (req, res) => {
  try {
    const { employeeIds, deductLeaves } = req.body;
    const createdSalaries = [];

    // Fetch current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based index

    // Iterate through each employee
    for (let i = 0; i < employeeIds.length; i++) {
      const employeeId = employeeIds[i];
      const currentDeductLeaves = deductLeaves[i]; // Get the deductLeaves value for the current employee

      // Fetch leaves for the employee for the current month
      const currentMonthLeaves = await Leaves.findOne({ employeeId, month: currentMonth });

      // Fetch the employee's loans
      const employeeLoans = await Loans.find({ employeeId });

      // Assuming you have a method to get baseSalary for an employee, replace Employee.baseSalary with the actual method
      const baseSalary = await getBaseSalaryForEmployee(employeeId);

      if (isNaN(baseSalary)) {
        console.error(`Invalid baseSalary for employeeId: ${employeeId}`);
        continue; // Skip to the next employee if baseSalary is not a number
      }

      // Calculate the salary by deducting leaves if deductLeaves is true
      const deductedLeaves = currentMonthLeaves ? currentMonthLeaves.days : 0;
      const calculatedSalary = baseSalary - (currentDeductLeaves ? deductedLeaves*100 : 0);

      // Deduct the monthly installment from each loan
      for (const loan of employeeLoans) {
        const monthlyInstallment = loan.amount / loan.durationMonths;
        const updatedRemainingAmount = loan.remainingAmount - monthlyInstallment;

        // Update the loan with the new remaining amount
        if (updatedRemainingAmount <= 0) {
          await Loans.deleteOne({ _id: loan._id });
        } else {
          // Update the loan with the new remaining amount
          await Loans.findByIdAndUpdate(loan._id, { remainingAmount: updatedRemainingAmount });
        }
      }

      // Calculate the total remaining loan amount for deduction
      const totalRemainingLoanAmount = employeeLoans.reduce((total, loan) => total + loan.amount/loan.durationMonths, 0);

      // Deduct the total remaining loan amount from the calculated salary
      const finalSalary = calculatedSalary - totalRemainingLoanAmount;

      if (isNaN(finalSalary)) {
        console.error(`Invalid finalSalary for employeeId: ${employeeId}`);
        continue; // Skip to the next employee if finalSalary is not a number
      }

      // Create the salary
      const newSalary = new Salary({
        employeeId,
        deductLeaves: currentDeductLeaves, // Use the deductLeaves value for the current employee
        deductedLeaves,
        totalLoanAmount: totalRemainingLoanAmount,
        finalSalary,
      });

      // Save the salary
      await newSalary.save();

      // Add the created salary to the response array
      createdSalaries.push({
        employeeId,
        finalSalary,
      });
    }

    res.json({ success: true, message: 'Salaries created successfully', createdSalaries });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});



const getBaseSalaryForEmployee = async (employeeId) => {
  try {
    // Replace 'baseSalary' with the actual field name in your Employee model
    const employee = await Employee.findById(employeeId, 'salary');

    if (!employee) {
      console.error(`Employee not found for ID: ${employeeId}`);
      return NaN; // Return NaN if employee is not found
    }

    // Replace 'baseSalary' with the actual field name in your Employee model
    const baseSalary = employee.salary;

    if (isNaN(baseSalary)) {
      console.error(`Invalid baseSalary for employeeId: ${employeeId}`);
      return NaN; // Return NaN if baseSalary is not a number
    }

    return baseSalary;
  } catch (error) {
    console.error(`Error fetching baseSalary for employeeId ${employeeId}: ${error.message}`);
    return NaN; // Return NaN in case of an error
  }
};


// Create salary
// Create salary
router.post('/', async (req, res) => {
  try {
    const { employeeId, baseSalary, deductLeaves } = req.body;

    // Fetch leaves for the employee for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns zero-based index
    const currentMonthLeaves = await Leaves.findOne({ employeeId, month: currentMonth });

    // Calculate the salary by deducting leaves if deductLeaves is true
    const deductedLeaves = deductLeaves ? (currentMonthLeaves ? currentMonthLeaves.days : 0) : 0;
    const calculatedSalary = baseSalary - deductedLeaves;

    // Fetch the employee's loans
    const employeeLoans = await Loans.find({ employeeId });

    // Deduct the monthly installment from each loan
    for (const loan of employeeLoans) {
      const monthlyInstallment = loan.amount / loan.durationMonths;
      const updatedRemainingAmount = loan.remainingAmount - monthlyInstallment;

      // Update the loan with the new remaining amount
      if (updatedRemainingAmount <= 0) {
        await Loans.deleteOne({ _id: loan._id });
      } else {
        // Update the loan with the new remaining amount
        await Loans.findByIdAndUpdate(loan._id, { remainingAmount: updatedRemainingAmount });
      }
      }

    // Calculate the total remaining loan amount for deduction
    const totalRemainingLoanAmount = employeeLoans.reduce((total, loan) => total + loan.remainingAmount, 0);

    // Deduct the total remaining loan amount from the calculated salary
    const finalSalary = calculatedSalary - totalRemainingLoanAmount;

    // Create the salary
    const newSalary = new Salary({
      employeeId,
      baseSalary,
      deductLeaves,
      deductedLeaves,
      totalLoanAmount: totalRemainingLoanAmount,
      finalSalary, // Include the final salary after deducting loans
    });

    const savedSalary = await newSalary.save();

    res.json({ salary: savedSalary, finalSalary });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


// Update salary
router.put('/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    const { baseSalary, deductLeaves, totalLoanAmount } = req.body;

    // Fetch leaves for the employee for the current month
    const currentMonthLeaves = await Leaves.findOne({ employeeId, month: 'currentMonth' });

    // Calculate the salary by deducting leaves if deductLeaves is true
    const deductedLeaves = deductLeaves ? (currentMonthLeaves ? currentMonthLeaves.days : 0) : 0;
    const calculatedSalary = baseSalary - deductedLeaves;

    // Update totalLoanAmount in salary
    const updatedTotalLoanAmount = totalLoanAmount; // You need to fetch this from your loans data

    // Update the salary
    const updatedSalary = await Salary.findOneAndUpdate(
      { employeeId },
      {
        baseSalary,
        deductLeaves,
        deductedLeaves,
        totalLoanAmount: updatedTotalLoanAmount,
      },
      { new: true }
    );

    res.json({ salary: updatedSalary, calculatedSalary });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});


// Delete salary
router.delete('/:employeeId', async (req, res) => {
  try {
    const employeeId = req.params.employeeId;
    await Salary.findOneAndDelete({ employeeId });
    res.json({ success: true, message: 'Salary deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
