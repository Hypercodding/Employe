import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Form, Field } from 'react-final-form';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';

function Emp({ Emp, loadData }) {
  
let navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
   navigate('/fetchUserData');
  };
  const divert = async () => {
    navigate('/register');
   };
  const onSubmit = async (data, form) => {
    setFormData(data);
  
    const { _id, name, salary, gender, phoneNumber,employeeStatus, cnic, department, dateOfBirth, dateOfHiring, designation } = data;
  
    try {
      var response = await fetch(`http://localhost:3500/api/employee/updateemp/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, salary, gender, phoneNumber,employeeStatus, cnic, department, dateOfBirth, dateOfHiring, designation })
      });
  
    } catch (error) {
      console.error('Network error:', error.message);
    }
  
    if (response.ok) {
      
      const json = await response.json();
      console.log(json);
      loadData();
      // Reset the form
      form.restart();
      setVisible(false);
  
      navigate('/employee');
    }
  
    form.restart();
  };
 

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const genderOptions = [
      
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'other' },
  ];

  const statusOptions = [
  
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'InActive' },
    
  ];

  const paginatorLeft = <div> <Button type="button" icon="pi pi-plus" style={{ fontSize: '1rem' }} text onClick={divert}/></div>;

  const paginatorRight = (
    <CSVLink data={Emp} filename="employee_data.csv">
      <Button type="button" icon="pi pi-download" />
    </CSVLink>
  );

  const renderActions = (rowData) => {
    return (
      <div>
      <i className="pi pi-pencil mx-3" onClick={() => handleEdit(rowData)}></i>
      <i className="pi pi-trash" onClick={() => handleDelete(rowData)}></i>

      </div>

      
    );
  };

  const handleDelete = async(data, form)=>{
    setFormData(data);
  
    const { _id} = data;
  
    var response =await fetch(`http://localhost:3500/api/employee/deleteemp/${_id}`, {
      method: 'DELETE',

      
  } )
  loadData()
};

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    

  const handleEdit = (rowData) => {
    setSelectedEmployee(rowData);
    setVisible(true);
  };

  return (
    <div className="employee-table">
      <DataTable
        value={Emp}
        // key={tableKey}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
      <Column field="name" header="Name" />
      <Column field="company.name" header="Company" />
      <Column field="dateOfBirth" header="dateOfBirth" body={(rowData) => formatDate(rowData.dateOfBirth)} />
      <Column field="gender" header="Gender" />
      <Column
        field="employeeStatus"
        header="Status"
        body={(rowData) => (
          <span style={{ color: rowData.employeeStatus === 'Active' ? 'black' : 'red' }}>
            {rowData.employeeStatus}
          </span>
        )}
      />
      <Column field="cnic" header="CNIC" />
      <Column field="phoneNumber" header="Number" />
      <Column field="salary" header="Salary" />
      

      <Column body={renderActions} header="Actions" />
      </DataTable>

      {/* Edit Modal */}
      <Dialog visible={visible} modal onHide={() => setVisible(false)}>
        <div className="form-demo">
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">Edit Employee</h5>
              <Form onSubmit={onSubmit} initialValues={selectedEmployee}  render={({ handleSubmit }) => (
                
                <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-grid p-formgrid">
            <div className="p-col">

        <Field name="name" render={({ input, meta }) => (
            <div className="field">
                <span className="p-float-label">
                    <InputText id="name" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                    <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Name*</label>
                </span>
                
            </div>
        )} />
        </div>
        <div className="p-col">
        <Field name="salary" render={({ input, meta }) => (
            <div className="field">
                <span className="p-float-label">
                    <InputText id="salary" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                    <label htmlFor="salry" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Salary*</label>
                </span>
            </div>
        )} />
        </div>
        <div className="p-col">
            <Field name="designation" render={({ input, meta }) => (
            <div className="field">
                <span className="p-float-label">
                    <InputText id="designation" {...input}  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                    <label htmlFor="designation" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Job Title*</label>
                </span>
            </div>
        )} />
        </div>
       
        <Field name="employeeStatus" render={({ input }) => (
            <div className="field">
                <span className="p-float-label">
                    <Dropdown id="employeeStatus" {...input}  options={statusOptions} optionLabel="label" />
                    <label htmlFor="employeeStatus">Status</label>
                </span>
            </div>
        )} />
        
        
      <Field
        name="phoneNumber"
        render={({ input, meta }) => (
          <div className="field">
            <span className="p-float-label">
              <InputMask
                id="phoneNumber"
                {...input}
                
                // onBlur={onBlur}
                className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                mask="999-9999999"
              />
              <label htmlFor="phoneNumber" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                Number*
              </label>
            </span>
          </div>
        )}
      />
        </div>
                  {/* Add other form fields for editing */}

                  <Button type="submit" label="Update" className="mt-2" />
                  <Button type="button" label="Cancel" onClick={() => setVisible(false)} className="p-button-secondary mt-2" />
                </form>
              )} />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Emp;
