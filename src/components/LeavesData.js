import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import {  useNavigate } from 'react-router-dom';
import AddLeave from './AddLeaves';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Form, Field } from 'react-final-form';
import { Dialog } from 'primereact/dialog';

function LeavesData({ LeavesData, loadData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/register_company');
  };

  const onSubmit = async (data, form) => {
    setFormData(data);
  
    const { _id, days, month, year } = data;
  
    try {
      var response = await fetch(`http://localhost:3500/api/leave/updateLeave/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days, month, year })
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
  
      navigate('/Leaves');
    }
  
    form.restart();
  };
 


  const monthMap = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const getMonthName = (monthNumber) => {
    return monthMap[monthNumber];
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginatorLeft = <AddLeave loadData={loadData} />;
  const paginatorRight = (
    <div className="button-container"><CSVLink data={LeavesData} filename="employee_data.csv">
      <Button type="button" icon="pi pi-download" />
    </CSVLink>
    </div>
  );

  const renderActions = (rowData) => {
    return (
      <div>
        <i className="pi pi-pencil mx-3" onClick={() => handleEdit(rowData)}></i>
        <i className="pi pi-trash" onClick={() => handleDelete(rowData)}></i>
      </div>
    );
  };

  const handleDelete = async (data, form) => {
    setFormData(data);

    const { _id, name, salary, gender, phone_number, employee_status, cnic, department, dob, date_of_hire, job_title } = data;

    var response = await fetch(`http://localhost:3500/api/leave/deleteLeave/${_id}`, {
      method: 'DELETE',
    });
    loadData();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
  };

  const handleEdit = (rowData) => {
    setSelectedLeaves(rowData);
    setVisible(true);
  };

  return (
    <>
      <div className="Company-table">
        <DataTable
          value={LeavesData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
        >
          <Column field="employeeName" header="Name" />
          <Column field="employeeCnic" header="Cnic" />
          <Column field="startDate" header="Start Date"  body={(rowData) => formatDate(rowData.startDate)} />
          <Column field="endDate" header="End Date"  body={(rowData) => formatDate(rowData.endDate)}/>
          <Column field="days" header="Total Days" />
          <Column
            field="month"
            header="Month"
            body={(rowData) => `${getMonthName(rowData.month)} ${rowData.year}`}
          />

          <Column body={renderActions} header="Actions" />
        </DataTable>

        <Dialog visible={visible} modal onHide={() => setVisible(false)}>
        <div className="form-demo">
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">Edit Leaves</h5>
              <Form onSubmit={onSubmit} initialValues={selectedLeaves}  render={({ handleSubmit }) => (
                
                <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-grid p-formgrid">
            
        <div className="p-col">
        <Field name="days" render={({ input, meta }) => (
                <div className="field">
                  <span className="p-float-label">
                    <InputNumber id="days" value={parseInt(input.value)} onValueChange={(e) => input.onChange(e.value)} autoFocus />
                    <label htmlFor="days" >days*</label>
                  </span>
                </div>
              )} />

        </div>
       
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
      {/* <AddLeave /> */}
    </>
  );
}

export default LeavesData;
