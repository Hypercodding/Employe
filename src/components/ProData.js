import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';

function ProData({ ProData, loadData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/register_company');
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
    setSelectedCompany(rowData);
    setVisible(true);
  };

  const generateOutpass = async (rowData) => {
    try {
      // Make a POST request to the outpass generation endpoint
      const response = await fetch(`http://localhost:3500/api/product/generateOutpassPDF/${rowData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You may need to include additional headers like authorization if required
        },
      });
  
      if (response.ok) {
        const blob = await response.blob();
  
        // Create a download link
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
  
        // Extract the filename from the content-disposition header if available
        const contentDisposition = response.headers.get('content-disposition');
        const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
        const filename = filenameMatch ? filenameMatch[1] : `outpass_${rowData._id}.pdf`;
  
        // Set the download attribute with the filename
        link.setAttribute('download', filename);
  
        // Append the link to the document and trigger the click event
        document.body.appendChild(link);
        link.click();
  
        // Remove the link from the document
        document.body.removeChild(link);
  
        // Optionally, you can handle the generated PDF path or perform additional actions
        console.log('Outpass downloaded successfully:', filename);
      } else {
        console.error('Failed to generate outpass:', response.status, response.statusText);
  
        // Display an error message to the user
        alert('Failed to generate outpass. Please try again.');
      }
    } catch (error) {
      console.error('Error generating outpass:', error.message);
  
      // Display an error message to the user
      alert('Error generating outpass. Please try again.');
    }
  };
  
  const renderActions = (rowData) => {
    return (
      <div>
        {/* <i className="pi pi-pencil mx-2" onClick={() => handleEdit(rowData)}></i>
        <i className="pi pi-trash mx-3" onClick={() => handleDelete(rowData)}></i> */}
        <i className="pi pi-print" onClick={() => generateOutpass(rowData)}></i>
        {/* <Button label="Generate Outpass" onClick={() => generateOutpass(rowData)} /> */}
      </div>
    );
  };

  return (
    <div className="Company-table">
      <DataTable
        value={ProData}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={<Button type="button" icon="pi pi-plus" text onClick={refreshTable} />}
        paginatorRight={<CSVLink data={ProData} filename="employee_data.csv"><Button type="button" icon="pi pi-download" /></CSVLink>}
      >
        <Column field="productName" header="Product Name" />
        <Column field="productQuantity" header="Quantity" />
        <Column field="customer" header="Customer" />
        <Column field="amount" header="Amount" />
        <Column body={renderActions} header="Actions" />
      </DataTable>
    </div>
  );
}

export default ProData;
