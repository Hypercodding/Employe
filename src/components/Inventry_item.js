// components/Inventry_item.jsx
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Form, Field } from 'react-final-form';
import { Dialog } from 'primereact/dialog';


function Inventry_item({ Items, loadData }) {
  const navigate = useNavigate();
  const [tableKey] = useState(0);
  const [itemState, setItemState] = useState([]);
  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  
  useEffect(() => {
    setItemState(Items);
  }, [Items]);

  const refreshTable = async () => {
      navigate('/add_item');
  };

  const renderActions = (rowData) => {
    return (
      <div>
      <i className="pi pi-pencil mx-3" onClick={() => handleEdit(rowData)}></i>
      {/* <i className="pi pi-trash" onClick={() => handleDelete(rowData)}></i> */}

      </div>

      
    );
  };
  const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleEdit = (rowData) => {
    setSelectedItem(rowData);
    setVisible(true);
  };
  const paginatorLeft = <Button type="button" icon="pi pi-plus" text onClick={refreshTable} />;
  const paginatorRight = (
    <CSVLink data={Items} filename="Inventry.csv">
      <Button type="button" icon="pi pi-download" />
    </CSVLink>
  );
  const [setFormData] = useState({});

  const onSubmit = async (data, form) => {
    setFormData(data);
  
    const { _id,itemQuantity} = data;
  
    try {
      var response = await fetch(`http://localhost:3500/api/items/updateItem/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemQuantity})
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
  
      navigate('/inventry');
    }
  
    form.restart();
  };

  return (
    <div className="Company-table">
      <DataTable
        value={itemState}
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
        <Column field="itemName" header="Name" />
        <Column field="itemQuantity" header="Quantity" />
        <Column field="cmp.name" header="Company" />
        <Column field="vendor" header="Vendor" />
        <Column body={renderActions} header="Actions" />
      </DataTable>
    
      {/* //Modal */}
       {/* Edit Modal */}
       <Dialog visible={visible} modal onHide={() => setVisible(false)}>
        <div className="form-demo">
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">Edit Item</h5>
              <Form onSubmit={onSubmit} initialValues={selectedItem}  render={({ handleSubmit }) => (
                
                <form onSubmit={handleSubmit} className="p-fluid">
                <div className="p-grid p-formgrid">
           
        <div className="p-col">
        <Field name="itemQuantity" render={({ input, meta }) => (
            <div className="field">
                <span className="p-float-label">
                    <InputText id="itemQuantity" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                    <label htmlFor="itemQuantity" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Quantity*</label>
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
  );
}

export default Inventry_item;
