import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
// import AddLeave from './AddLeaves';

function AccountData({ AccountData, loadData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/account');
  };

 
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginatorLeft = <Button type="button" icon="pi pi-plus" text onClick={refreshTable} />;
  const paginatorRight = (
    <div className="button-container"><CSVLink data={AccountData} filename="employee_data.csv">
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

    const { _id} = data;

    var response = await fetch(`http://localhost:3500/api/emp/deleteemp/${_id}`, {
      method: 'DELETE',
    });
    loadData();
  };


  const handleEdit = (rowData) => {
    setSelectedLeaves(rowData);
    setVisible(true);
  };

  return (
    <>
      <div className="Company-table">
        <DataTable
          value={AccountData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
        >
          <Column field="bankName" header="Name" />
          <Column field="totalAmount" header="Amount" />
          {/* <Column body={renderActions} header="Actions" /> */}
        </DataTable>

        {/* Edit Modal */}
      </div>
      {/* <AddLeave /> */}
    </>
  );
}

export default AccountData;
