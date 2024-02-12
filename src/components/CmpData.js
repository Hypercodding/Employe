import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Form, Field } from 'react-final-form';
import { Dropdown } from 'primereact/dropdown';


function CmpData({ CmpData, loadData }) {
  const navigate = useNavigate();
// let navigate = useNavigate();
const [tableKey, setTableKey] = useState(0);
const [cmpState, setCmpState] = useState([]);

  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/register_company');
  };
  
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const paginatorLeft = <Button type="button" icon="pi pi-plus" text onClick={refreshTable}/>;
  const paginatorRight = (
    <CSVLink data={CmpData} filename="employee_data.csv">
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
  
    const { _id, name, salary, gender, phone_number,employee_status, cnic, department, dob, date_of_hire, job_title } = data;
  
    var response =await fetch(`http://localhost:3500/api/company/delete/${_id}`, {
      method: 'DELETE',

      
  } )
  loadData()
};

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

  const handleEdit = (rowData) => {
    setSelectedCompany(rowData);
    setVisible(true);
  };
  const onSubmit = async (data, form) => {
    setFormData(data);
  
    const { _id,managerId, companyStatus, name } = data;
  
    try {
      var response = await fetch(`http://localhost:3500/api/company/updateCompany/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ managerId, companyStatus, name })
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
  
      navigate('/Company');
    }
  
    form.restart();
  };
  const statusOption = [
    { label: 'Active', value: 'Active' },
    { label: 'InActive', value: 'InActive' },
]
  return (
    <div className="Company-table">
      <DataTable
        value={CmpData}
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
      
      <Column field="companyStatus" header="Status"  body={(rowData) => (
          <span style={{ color: rowData.companyStatus === 'Active' ? 'black' : 'red' }}>
            {rowData.companyStatus}
          </span>
        )}/>
      
      <Column field="employeeCount" header="Employee count" />
    //   <Column body={renderActions} header="Actions" /> 
      </DataTable>

      <Dialog visible={visible} modal onHide={() => setVisible(false)}>
        <div className="form-demo">
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">Edit Leaves</h5>
              <Form onSubmit={onSubmit} initialValues={selectedCompany}  render={({ handleSubmit }) => (
                
                <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-grid p-formgrid">
            
        <div className="p-col">
        <Field
              name="companyStatus"
              render={({ input, meta }) => (
                  <div className="field">
                  <span className="p-float-label">
                      <Dropdown id="companyStatus" {...input} options={statusOption} optionLabel="label" />
                      <label htmlFor="companyStatus">
                      Status*
                      </label>
                  </span>
                  {/* {getFormErrorMessage(meta)} */}
                  </div>
              )}
          />

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
  );
}

export default CmpData;
