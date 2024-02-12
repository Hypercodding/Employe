// SalaryForm.js

import React, { useState, useEffect } from 'react';
import { Button, DataTable, Column, InputSwitch, Checkbox } from 'primereact';

const SalaryForm = () => {
  const [employees, setEmployees] = useState([]);
  const [deductLeaves, setDeductLeaves] = useState({});
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [createdSalaries, setCreatedSalaries] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Fetch the list of employees when the component mounts
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/employee/employeeLeaveInfo');
        if (response.ok) {
          const json = await response.json();

          // Initialize deductLeaves state with all employees having false
          const initialDeductLeaves = {};
          json.forEach((employee) => {
            initialDeductLeaves[employee._id] = false;
          });

          setEmployees(json);
          setDeductLeaves(initialDeductLeaves);
        }
      } catch (error) {
        console.error('Error fetching Employees:', error.message);
      }
    };

    fetchEmployees();
  }, []);

  const handleDeductLeavesChange = (e, rowData) => {
    const employeeId = rowData._id;
    const isChecked = e.value;

    // Update the deductLeaves value for the specific employee
    setDeductLeaves((prevDeductLeaves) => ({
      ...prevDeductLeaves,
      [employeeId]: isChecked,
    }));
  };

  const handleEmployeeSelectionChange = (e, rowData) => {
    const employeeId = rowData._id;
    const isChecked = e.checked;

    // Update the selectedEmployees array based on the checkbox state
    if (isChecked) {
      setSelectedEmployees((prevSelectedEmployees) => [...prevSelectedEmployees, employeeId]);
    } else {
      setSelectedEmployees((prevSelectedEmployees) => prevSelectedEmployees.filter((id) => id !== employeeId));
    }
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);

    if (!selectAll) {
      // Select all employees
      setSelectedEmployees(employees.map((employee) => employee._id));
    } else {
      // Deselect all employees
      setSelectedEmployees([]);
    }
  };

  const renderSelectAllCheckbox = () => (
    <Checkbox
      checked={selectAll}
      onChange={handleSelectAllChange}
      className="p-checkbox-rounded"
    />
  );

  const renderEmployeeCheckbox = (rowData) => (
    <Checkbox
      checked={selectedEmployees.includes(rowData._id)}
      onChange={(e) => handleEmployeeSelectionChange(e.target, rowData)}
      className="p-checkbox-rounded"
    />
  );

  const handleSubmit = async () => {
    try {
      // Submit only for the selected employees
      const response = await fetch('http://localhost:3500/api/salary/create-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeIds: selectedEmployees,
          deductLeaves: selectedEmployees.map((employeeId) => deductLeaves[employeeId]),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedSalaries(result.createdSalaries);
      }
    } catch (error) {
      console.error('Network error:', error.message);
    }
  };

  return (
    <div>
      <h2>Create Salaries</h2>
      <DataTable value={employees}>
        <Column header={renderSelectAllCheckbox()} body={renderEmployeeCheckbox} />
        <Column field="employeeName" header="Employee Name" />
        <Column
    header="Leaves"
    body={(rowData) => (
      <span>{rowData.leaveDays !== null ? rowData.leaveDays : "No leave"}</span>
    )}
  />
  <Column
    header="Leaves (in %)"
    body={(rowData) => (
      <span>{rowData.leaveDays !== null ? rowData.leaveDays * 100 : ''}</span>
    )}
  />
        <Column header="Deduct Leave" body={(rowData) => (
          <InputSwitch
            checked={deductLeaves[rowData._id] || false}
            onChange={(e) => handleDeductLeavesChange(e, rowData)}
          />
        )} />
      </DataTable>
      <Button label="Submit" className="p-button-success" onClick={handleSubmit} />

      {createdSalaries.length > 0 && (
        <div>
          <h3 className="">Created Salaries</h3>
          <DataTable value={createdSalaries} emptyMessage="No salaries created">
            <Column field="employeeId" header="Employee ID" />
            <Column field="finalSalary" header="Final Salary" />
          </DataTable>
        </div>
      )}
    </div>
  );
};

export default SalaryForm;
