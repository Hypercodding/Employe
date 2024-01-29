import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Form, Field } from 'react-final-form';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';

function Emp({ Emp, loadData }) {
  
let navigate = useNavigate();
const [tableKey, setTableKey] = useState(0);
const [empState, setEmpState] = useState([]);

  const [visible, setVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    try {
      // Replace 'fetchData' with your actual data fetching function
      const newData = await fetch("http://localhost:3500/api/emp/fetchallemp"); 
      setEmpState(newData);

      // Update the key to trigger a re-render
      setTableKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const onSubmit = async (data, form) => {
    setFormData(data);
  
    const { _id, name, salary, gender, phone_number,employee_status, cnic, department, dob, date_of_hire, job_title } = data;
  
    try {
      var response = await fetch(`http://localhost:3500/api/emp/updateemp/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, salary, gender, phone_number,employee_status, cnic, department, dob, date_of_hire, job_title })
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
  
    { label: 'Active', value: 'active' },
    { label: 'Inacive', value: 'Inactive' },
    
  ];

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={refreshTable}/>;
  const paginatorRight = (
    <CSVLink data={Emp} filename="employee_data.csv">
      <Button type="button" icon="pi pi-download" />
    </CSVLink>
  );

  const renderActions = (rowData) => {
    return (
      <div>
      <i class="pi pi-pencil mx-3" onClick={() => handleEdit(rowData)}></i>
      <i class="pi pi-trash" onClick={() => handleDelete(rowData)}></i>

      </div>

      
    );
  };

  const handleDelete = async(data, form)=>{
    setFormData(data);
  
    const { _id, name, salary, gender, phone_number,employee_status, cnic, department, dob, date_of_hire, job_title } = data;
  
    var response =await fetch(`http://localhost:3500/api/emp/deleteemp/${_id}`, {
      method: 'DELETE',

      
  } )
  loadData()
};

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

  const handleEdit = (rowData) => {
    setSelectedEmployee(rowData);
    setVisible(true);
  };

  return (
    <div className="employee-table">
      <DataTable
        value={Emp}
        key={tableKey}
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
      <Column field="dob" header="DOB" body={(rowData) => formatDate(rowData.dob)} />
      <Column field="gender" header="Gender" />
      <Column
        field="employee_status"
        header="Status"
        body={(rowData) => (
          <span style={{ color: rowData.employee_status === 'Active' ? 'black' : 'red' }}>
            {rowData.employee_status}
          </span>
        )}
      />
      <Column field="cnic" header="CNIC" />
      <Column field="phone_number" header="Number" />
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
            <Field name="job_title" render={({ input, meta }) => (
            <div className="field">
                <span className="p-float-label">
                    <InputText id="job_title" {...input}  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                    <label htmlFor="job_title" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Job Title*</label>
                </span>
            </div>
        )} />
        </div>
        <Field name="department" render={({ input, meta }) => (
            <div className="field">
                <span className="p-float-label">
                    <InputText id="department" {...input}  className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                    <label htmlFor="department" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Department*</label>
                </span>
            </div>
        )} />
        <Field name="employee_status" render={({ input }) => (
            <div className="field">
                <span className="p-float-label">
                    <Dropdown id="employee_status" {...input}  options={statusOptions} optionLabel="label" />
                    <label htmlFor="employee_status">Status</label>
                </span>
            </div>
        )} />
        <Field
        name="cnic"
        render={({ input, meta }) => (
          <div className="field">
            <span className="p-float-label">
              <InputMask
                id="cnic"
                {...input}
                // autoFocus
                // onBlur={onBlur}
                className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                mask="99999-9999999-9"
              />
              <label htmlFor="cnic" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                CNIC*
              </label>
            </span>
          </div>
        )}
      />
      <Field
        name="phone_number"
        render={({ input, meta }) => (
          <div className="field">
            <span className="p-float-label">
              <InputMask
                id="phone_number"
                {...input}
                
                // onBlur={onBlur}
                className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                mask="999-9999999"
              />
              <label htmlFor="phone_number" className={classNames({ 'p-error': isFormFieldValid(meta) })}>
                Number*
              </label>
            </span>
          </div>
        )}
      />
        <Field name="dob" render={({ input }) => (
            <div className="field">
                <span className="p-float-label">
                    <Calendar id="dob" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                    <label htmlFor="dob">Date of Birth</label>
                </span>
            </div>
        )} />
        <Field name="date_of_hire" render={({ input }) => (
            <div className="field">
                <span className="p-float-label">
                    <Calendar id="date_of_hire" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                    <label htmlFor="date_of_hire">Date of Hire</label>
                </span>
            </div>
        )} />
        <Field name="gender" render={({ input }) => (
        <div className="field">
            <span className="p-float-label">
                <Dropdown id="gender" {...input} options={genderOptions} optionLabel="label" />
                <label htmlFor="country">Gender</label>
            </span>
        </div>
        )} />
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