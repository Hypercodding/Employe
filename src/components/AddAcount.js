import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';


const AddAccount = ({ onSubmit, loadData }) => {
    const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
   itemName: '',
    itemNo: 0,
    });

  


  const handleSubmit = async (data, form) => {
    setFormData(data);
    console.log('Request Body:', data);

    const {  bankName } = data;

    try {
      var response = await fetch("http://localhost:3500/api/account/add", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bankName })

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
      navigate('/account');
    }

  };

  return (
    <>
      <Button label="Add Account" icon="pi pi-plus" onClick={() => setVisible(true)} />

      <Dialog
        header="Add Account"
        visible={visible}
        style={{ width: '300px' }}
        onHide={() => setVisible(false)}
        breakpoints={{ '960px': '80vw' }}
      >
        <Form
          onSubmit={handleSubmit}
          initialValues={{ bankName: ''}}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
                <Field name="bankName" render={({ input }) => (
                <div className="field">
                    <span className="p-float-label">
                        <InputText id="bankName" {...input} />
                        <label htmlFor="bankName">Bank Name</label>
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

export default AddAccount;
