import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';


const AddItem = ({ onSubmit, loadData }) => {
    const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
   itemName: '',
    itemNo: 0,
    });

  


  const handleSubmit = async (data, form) => {
    setFormData(data);
    console.log('Request Body:', data);

    const {  itemName, itemNo } = data;

    try {
      var response = await fetch("http://localhost:3500/api/item/add", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemName, itemNo })

      });

    } catch (error) {
      console.error('Network error:', error.message);
    }
    if (response.ok) {
      const json = await response.json();
      console.log(json);
      setVisible(false);
      // Reset the form
      form.restart();
      loadData()
      navigate('/Item');
    }

  };

  return (
    <>
      <Button label="Add Item" icon="pi pi-plus" onClick={() => setVisible(true)} />

      <Dialog
        header="Add Leave"
        visible={visible}
        style={{ width: '300px' }}
        onHide={() => setVisible(false)}
        breakpoints={{ '960px': '80vw' }}
      >
        <Form
          onSubmit={handleSubmit}
          initialValues={{ itemName: '', itemNo: ''}}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
                <Field name="itemName" render={({ input }) => (
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="itemName" {...input} />
                        <label htmlFor="itemName">Item Name</label>
                    </span>
                </div>
                )} />

                <Field name="itemNo" render={({ input }) => (
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="itemNo" {...input}  />
                        <label htmlFor="itemNo">ItemID</label>
                    </span>
                </div>
                )} />
              
              <div className="p-mt-4">
                <Button label="Submit" onClick={handleSubmit} className="p-button-success mt-3" />
                <Button label="Cancel" onClick={() => setVisible(false)} className="p-button-secondary p-ml-2 mt-2" />
              </div>
            </form>
          )}
        />
      </Dialog>
    </>
  );
};

export default AddItem;
