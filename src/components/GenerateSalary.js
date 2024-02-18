
import React, { useState, useEffect, useRef } from 'react';
import { Button, DataTable, Column, InputSwitch, Checkbox } from 'primereact';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';


const SalaryForm = () => {
  const toast = useRef(null);
  //preview
  const [previewSalaries, setPreviewSalaries] = useState([]);
  const [previewDialogVisible, setPreviewDialogVisible] = useState(false);


  const handlePreview = () => {
    const previewData = selectedEmployees.map((employeeId) => {
      const employee = employees.find((e) => e._id === employeeId);
      const deductLeave = deductLeaves[employeeId] || false;
      const leaveDays = employee.leaveDays !== null ? employee.leaveDays : 0;
      const leavesAmount = leaveDays * 100;
      const finalSalary = deductLeave ? employee.salary - leavesAmount : employee.salary;

      return {
        employeeId: employee._id,
        employeeName: employee.employeeName,
        salary: employee.salary,
        leaveDays,
        leavesAmount,
        finalSalary,
      };
    });

    setPreviewSalaries(previewData);
    setPreviewDialogVisible(true);
  };

  const hidePreviewDialog = () => {
    setPreviewDialogVisible(false);
  };
  const [employees, setEmployees] = useState([]);
  const [deductLeaves, setDeductLeaves] = useState({});
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [createdSalaries, setCreatedSalaries] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Fetch the list of employees when the component mounts
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/employee/employeeSalaryInfo');
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
      if (selectedEmployees.length === 0) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Select at least one employee',
          life: 3000,
        });
        return; // Exit the function if no employee is selected
      }
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
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Generated',
          life: 3000,
      });
      }
      else {
            // console.error('Login failed:', response.status, response.statusText);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Select an employee',
                life: 3000,
            });
        }
    
    } catch (error) {
      console.error('Network error:', error.message);
    }
  };

  return (
    <div>
      <Toast ref={toast} position="top-center" />
      {/* <h2 style={{ textAlign: 'center'}}>Create Salaries</h2> */}
      <DataTable value={employees}>
        <Column header={renderSelectAllCheckbox()} body={renderEmployeeCheckbox} />
        <Column field="employeeName" header="Employee Name" />
        <Column field="salary" header="Salary" />
        <Column
    header="Leaves"
    body={(rowData) => (
      <span>{rowData.leaveDays !== null ? rowData.leaveDays : "No leave"}</span>
    )}
  />
  <Column
    header="Leaves Amount"
    body={(rowData) => (
      <span>{rowData.leaveDays !== null ? rowData.leaveDays * 100 : ''}</span>
    )}
  />
   {/* <Column field="finalSalary" header="Salary" /> */}
        <Column header="Deduct Leave" body={(rowData) => (
          <InputSwitch
            checked={deductLeaves[rowData._id] || false}
            onChange={(e) => handleDeductLeavesChange(e, rowData)}
          />
        )} />
      </DataTable>
      {/* <Button label="Submit" className="p-button-success" onClick={handleSubmit} /> */}
      <Button label="Preview " className="p-button-success ml-2" onClick={handlePreview} />

      <Dialog
        visible={previewDialogVisible}
        onHide={hidePreviewDialog}
        header="Salary Preview"
        footer={<Button label="Confirm and Submit" className="p-button-success" onClick={handleSubmit} />}
      >
        {previewSalaries.length > 0 ? (
          <DataTable value={previewSalaries} emptyMessage="No salaries to preview">
            <Column field="employeeName" header="Employee Name" />
            <Column field="salary" header="Salary" />
            <Column field="leaveDays" header="Leaves" />
            <Column field="leavesAmount" header="Leaves Amount" />
            <Column field="finalSalary" header="Final Salary" />
          </DataTable>
        ) : (
          <p>No salaries to preview.</p>
        )}
      </Dialog>
      </div>
  );
};

export default SalaryForm;
