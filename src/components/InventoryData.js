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

function InventoryData({ InventoryData, loadData }) {
  
let navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [selectedInventoryData, setSelectedInventoryData] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
   navigate('/fetchUserData');
  };
  const divert = async () => {
    navigate('/register');
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
    <CSVLink data={InventoryData} filename="InventoryData_data.csv">
      <Button type="button" icon="pi pi-download" />
    </CSVLink>
  );

  const renderActions = (rowData) => {
    return (
      <div>
     
      </div>

      
    );
  };


  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    

  const handleEdit = (rowData) => {
    setSelectedInventoryData(rowData);
    setVisible(true);
  };

  return (
    <div className="InventoryData-table">
      <DataTable
        value={InventoryData}
        // key={tableKey}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        paginatorTInventoryDatalate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTInventoryDatalate="{first} to {last} of {totalRecords}"
        paginatorLeft={paginatorLeft}
        paginatorRight={paginatorRight}
      >
        <Column field="itemDetails" header="Item Name" body={(rowData) => rowData.itemDetails.itemName} />
        <Column field="quantity" header="Quantity" />      
      
      </DataTable>

         </div>
  );
}

export default InventoryData;
