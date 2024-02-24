import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { CSVLink } from 'react-csv';
import {  useNavigate } from 'react-router-dom';
import AddItem from './AddItem';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { InputText } from 'primereact/inputtext';
import { Form, Field } from 'react-final-form';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';


function ItemData({ ItemData, loadData }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const refreshTable = async () => {
    navigate('/register_company');
  };

  const onSubmit = async (data, form) => {
    setFormData(data);
  
    const { _id,itemName, itemNo } = data;
  
    try {
      var response = await fetch(`http://localhost:3500/api/Item/updateItem/${_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, itemNo })
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
  
      navigate('/Item');
    }
  
    form.restart();
  };
 


  const paginatorLeft =  <AddItem loadData={loadData} />;
  const paginatorRight = (
    <div className="button-container"><CSVLink data={ItemData} filename="item_data.csv">
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

    var response = await fetch(`http://localhost:3500/api/Item/deleteItem/${_id}`, {
      method: 'DELETE',
    });
    loadData();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
  };

  const handleEdit = (rowData) => {
    const startDate = rowData.startDate ? new Date(rowData.startDate) : null;
    const endDate = rowData.endDate ? new Date(rowData.endDate) : null;
  
    // Set SelectedItem state with the converted dates
    setSelectedItem({
      ...rowData
    });
  
    setVisible(true);
  };

  return (
    <>
      <div className="Company-table">
        <DataTable
          value={ItemData}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '50rem' }}
          sortField="itemNo"  // Specify the field to sort
          sortOrder={1}  
          paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
        >
          <Column field="itemName" header="Name" />
          <Column field="itemNo" header="Item ID" />
      
          <Column body={renderActions} header="Actions" />
        </DataTable>

        <Dialog visible={visible} modal onHide={() => setVisible(false)}>
        <div className="form-demo">
          <div className="flex justify-content-center">
            <div className="card">
              <h5 className="text-center">Edit Items</h5>
              <Form
                onSubmit={onSubmit}
                initialValues={selectedItem} // Use an empty object as a fallback
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="p-fluid">
                    <div className="p-grid p-formgrid">
                      <div className="p-col">
                        <Field
                          name="itemName"
                          render={({ input }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="itemName"
                                  {...input}
                                 
                                />
                                <label htmlFor="itemName">Item Name</label>
                              </span>
                            </div>
                          )}
                        />

                        <Field
                          name="itemNo"
                          render={({ input }) => (
                            <div className="field">
                              <span className="p-float-label">
                                <InputText
                                  id="itemNo"
                                  {...input}
                             
                                />
                                <label htmlFor="itemNo">Item ID</label>
                              </span>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    {/* Add other form fields for editing */}
                    <Button type="submit" label="Update" className="mt-2" />
                    <Button
                      type="button"
                      label="Cancel"
                      onClick={() => setVisible(false)}
                      className="p-button-secondary mt-2"
                    />
                  </form>
                )}
              />
            </div>
          </div>
        </div>
      </Dialog>
      </div>
      {/* <AddItem /> */}
    </>
  );
}

export default ItemData;
