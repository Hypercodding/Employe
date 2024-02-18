import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import PdfMerger from 'pdf-merger-js'; // Import PdfMerger library
import { useNavigate } from 'react-router-dom';

function SalData({ SalData, loadData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/register_company');
  };

  useEffect(() => {
    // Sort the data by createdAt in descending order
    const sortedData = SalData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  setFormData(sortedData);
  }, [SalData]);

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
      const response = await fetch(`http://localhost:3500/api/salary/getAsPdf/${rowData._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        const filename = filenameMatch ? filenameMatch[1] : `SalarySlip_${rowData._id}_${rowData.employeeName}.pdf`;

        // Set the download attribute with the filename
        link.setAttribute('download', filename);

        // Append the link to the document and trigger the click event
        document.body.appendChild(link);
        link.click();

        // Remove the link from the document
        document.body.removeChild(link);

        // Optionally, you can handle the generated PDF path or perform additional actions
        console.log('Slip downloaded successfully:', filename);
      } else {
        console.error('Failed to generate Slip:', response.status, response.statusText);

        // Display an error message to the user
        alert('Failed to generate Slip. Please try again.');
      }
    } catch (error) {
      console.error('Error generating Slip:', error.message);

      // Display an error message to the user
      alert('Error generating outpass. Please try again.');
    }
  };

  const generateCollectivePdf = async () => {
    try {
      const merger = new PdfMerger(); // Create a PdfMerger instance

      // Make requests to the individual PDF generation endpoints and add to merger
      await Promise.all(
        SalData.map(async (employee) => {
          const response = await fetch(`http://localhost:3500/api/salary/getAsPdf/${employee._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            merger.add(blob); // Add each PDF stream to the merger
          } else {
            console.error(`Failed to generate PDF for Employee ID ${employee._id}`);
          }
        })
      );

      // Generate a single PDF by merging all individual PDFs
      const mergedPdf = await merger.saveAsBlob();

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([mergedPdf]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CollectiveSalarySlips.pdf');

      // Append the link to the document and trigger the click event
      document.body.appendChild(link);
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);

      console.log('Collective Slips downloaded successfully');
    } catch (error) {
      console.error('Error generating Collective Slips:', error.message);

      // Display an error message to the user
      alert('Error generating Collective Slips. Please try again.');
    }
  };

  const renderActions = (rowData) => {
    return (
      <div>
        <i className="pi pi-print" onClick={() => generateOutpass(rowData)}></i>
        {/* <Button label="Generate PDF" onClick={() => generateOutpass(rowData)} className="p-button-success" /> */}
      </div>
    );
  };
  const dateBodyTemplate = (rowData) => {
    const date = new Date(rowData.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', {day: '2-digit', month: '2-digit', year: 'numeric' });
    return formattedDate;
  };

  return (
    <div className="Company-table">
      <DataTable
        value={SalData}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: '50rem' }}
        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        paginatorLeft={<Button type="button" icon="pi pi-plus" text onClick={refreshTable} />}
        paginatorRight={
          <>
            <CSVLink data={SalData} filename="employee_data.csv">
              <Button type="button" icon="pi pi-download" />
            </CSVLink>
            {/* <Button type="button" label="Generate Collective PDF" icon="pi pi-file-pdf" className="p-button-danger" onClick={generateCollectivePdf} /> */}
          </>
        }
      >
        <Column field="employeeName" header="Name" />
        <Column field="employeeCnic" header="CNIC" />
        <Column field="baseSalary" header="Basic Salary" />
        <Column field="deductedLeaves" header="Leaves" />
        <Column field="totalLoanAmount" header="Loan Amount" />
        <Column field="finalSalary" header="Final Salary" />
        <Column field="createdAt" header="Date" body={dateBodyTemplate} />
        <Column body={renderActions} header="Actions" />
      </DataTable>
    </div>
  );
}

export default SalData;
