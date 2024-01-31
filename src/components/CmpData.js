import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

function CmpData({ CmpData, loadData }) {
  
// let navigate = useNavigate();
const [tableKey, setTableKey] = useState(0);
const [cmpState, setCmpState] = useState([]);

  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    try {
      const response = await fetch("http://localhost:3500/api/cmp/getCmp");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const newData = await response.json();
      setCmpState(newData);
  
      // Update the key to trigger a re-render
      setTableKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };


  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={refreshTable}/>;
  const paginatorRight = (
    <CSVLink data={CmpData} filename="employee_data.csv">
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
    setSelectedCompany(rowData);
    setVisible(true);
  };

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
      <Column field="owner" header="Owner" />
      
    {/* //   <Column body={renderActions} header="Actions" /> */} 
      </DataTable>

      {/* Edit Modal */} 
      </div>
  );
}

export default CmpData;
