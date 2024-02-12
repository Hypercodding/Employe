import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import AddLeave from './AddLeaves';
import AddLoan from './AddLoans';

function LoanData({ LoanData, loadData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedLeaves, setSelectedLeaves] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/register_company');
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

  const paginatorLeft = <AddLoan loadData={loadData}/>;
  const paginatorRight = (
    <div className="button-container"><CSVLink data={LoanData} filename="employee_data.csv">
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

    var response = await fetch(`http://localhost:3500/api/emp/deleteemp/${_id}`, {
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
          value={LoanData}
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
          <Column field="amount" header="Amount" />
          <Column field="durationMonths" header="Duration" />
          <Column field="remainingAmount" header="Remaing Amount" />
          {/* <Column body={renderActions} header="Actions" /> */}
        </DataTable>

        {/* Edit Modal */}
      </div>
      {/* <AddLeave /> */}
    </>
  );
}

export default LoanData;
